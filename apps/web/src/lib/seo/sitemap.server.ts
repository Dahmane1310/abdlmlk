import { z } from 'zod'

import { type Language, LANGUAGES } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'
import { escapeXml } from '@/lib/xml'

/** One page in one language: where it lives, and when it last changed. */
interface Version {
  lang: Language
  path: string
  lastmod?: string
}

// The same page in each language it exists in.
type Page = Version[]

// Pages that exist in every language, with nothing in the CMS to date them.
const FIXED_PATHS = ['', '/about', '/projects', '/blog']

// The CMS collections with a page per entry, and where that page lives.
const COLLECTIONS = [
  { resource: 'projects', path: (slug: string) => `/projects/${slug}` },
  { resource: 'articles', path: (slug: string) => `/blog/${slug}` },
  { resource: 'series-list', path: (slug: string) => `/blog/series/${slug}` },
]

const entriesPageSchema = z.object({
  data: z.array(
    z.object({
      /** Shared by an entry's languages: what ties translations together. */
      documentId: z.string(),
      slug: z.string(),
      updatedAt: z.iso.datetime(),
    }),
  ),
  meta: z.object({ pagination: z.object({ pageCount: z.number() }) }),
})

/** Every published entry of a collection in one language, page after page. */
async function entriesOf(resource: string, lang: Language) {
  const entries: z.output<typeof entriesPageSchema>['data'] = []
  // The CMS sends at most 100 entries per request.
  for (let page = 1; ; page++) {
    const response = await getStrapiClient()
      .collection(resource)
      .find({
        locale: lang,
        fields: ['slug', 'updatedAt'],
        pagination: { page, pageSize: 100 },
      })
    const { data, meta } = entriesPageSchema.parse(response)
    entries.push(...data)
    if (page >= meta.pagination.pageCount) return entries
  }
}

/** A collection's pages, each with its versions in the languages it has. */
async function collectionPages({
  resource,
  path,
}: (typeof COLLECTIONS)[number]) {
  const pages = new Map<string, Page>()
  for (const lang of LANGUAGES) {
    for (const entry of await entriesOf(resource, lang)) {
      const page = pages.get(entry.documentId) ?? []
      page.push({ lang, path: path(entry.slug), lastmod: entry.updatedAt })
      pages.set(entry.documentId, page)
    }
  }
  return [...pages.values()]
}

/**
 * One <url> per page and language, listing the page's other languages as
 * hreflang alternates (and English as x-default), as the pages' heads do.
 */
function urlEntries(siteUrl: string, page: Page) {
  const href = ({ lang, path }: Version) =>
    escapeXml(`${siteUrl}/${lang}${path}`)
  const english = page.find((version) => version.lang === 'en')
  const alternates = [
    ...page.map(
      (version) =>
        `<xhtml:link rel="alternate" hreflang="${version.lang}" href="${href(version)}"/>`,
    ),
    english
      ? `<xhtml:link rel="alternate" hreflang="x-default" href="${href(english)}"/>`
      : '',
  ].join('')

  return page.map((version) =>
    [
      '<url>',
      `<loc>${href(version)}</loc>`,
      version.lastmod ? `<lastmod>${version.lastmod}</lastmod>` : '',
      alternates,
      '</url>',
    ].join(''),
  )
}

/**
 * The sitemap (ARCHITECTURE.md, "SEO"): every page the site has, in every
 * language it exists in. Filtered lists, the feeds and "/" (a redirect) aren't
 * pages of their own, so they're left out.
 */
export async function buildSitemap(siteUrl: string) {
  const fixed = FIXED_PATHS.map((path) =>
    LANGUAGES.map((lang) => ({ lang, path })),
  )
  const fromCms = (await Promise.all(COLLECTIONS.map(collectionPages))).flat()

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...[...fixed, ...fromCms].flatMap((page) => urlEntries(siteUrl, page)),
    '</urlset>',
  ].join('\n')
}
