import type { Language } from '@/lib/i18n/config'
import { escapeXml } from '@/lib/xml'

import type { ArticleSummary } from './blog.functions'

// RSS dates are RFC 822, which toUTCString() writes: "Tue, 27 Oct 2026 00:00:00 GMT".
const rssDate = (isoDate: string) => new Date(isoDate).toUTCString()

/**
 * One language's articles as RSS 2.0 (ARCHITECTURE.md, "RSS"): a summary of
 * each, linking to the site. The newest first, as the CMS sends them.
 */
export function buildRssFeed({
  siteUrl,
  lang,
  title,
  description,
  articles,
}: {
  /** The site's public address, without a trailing slash. */
  siteUrl: string
  lang: Language
  title: string
  description: string
  articles: ArticleSummary[]
}) {
  const blogUrl = `${siteUrl}/${lang}/blog`
  const newest = articles.at(0)

  const items = articles.map((article) => {
    const url = `${blogUrl}/${article.slug}`
    return [
      '<item>',
      `<title>${escapeXml(article.title)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<pubDate>${rssDate(article.publishedDate)}</pubDate>`,
      article.description
        ? `<description>${escapeXml(article.description)}</description>`
        : '',
      ...article.tags.map(
        (tag) => `<category>${escapeXml(tag.name)}</category>`,
      ),
      '</item>',
    ].join('')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(title)}</title>`,
    `<link>${escapeXml(blogUrl)}</link>`,
    `<description>${escapeXml(description)}</description>`,
    `<language>${lang}</language>`,
    `<atom:link href="${escapeXml(`${siteUrl}/${lang}/rss.xml`)}" rel="self" type="application/rss+xml"/>`,
    newest
      ? `<lastBuildDate>${rssDate(newest.publishedDate)}</lastBuildDate>`
      : '',
    ...items,
    '</channel>',
    '</rss>',
  ].join('\n')
}
