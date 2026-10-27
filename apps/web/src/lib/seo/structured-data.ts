import type { Language } from '@/lib/i18n/config'

// Schema.org data as JSON-LD (ARCHITECTURE.md, "SEO"): what Google reads to
// describe a page in its results. Plain JSON, as the router's head takes it.
type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }
export type JsonLd = Record<string, JsonValue>

/** The root route's context: the site's address and name, and its owner. */
interface SiteContext {
  siteUrl: string
  siteSettings: { siteName: string }
  profile: {
    fullName: string
    headline: string
    intro: string
    location: string | null
    socials: { url: string }[]
  }
}

const SCHEMA = 'https://schema.org'

const homeUrl = (context: SiteContext, lang: Language) =>
  `${context.siteUrl}/${lang}`

/**
 * The site's owner. The email stays out, away from spammers' crawlers; the
 * social profiles (`sameAs`) tie them to the site.
 */
function person(context: SiteContext, lang: Language): JsonLd {
  const { profile } = context
  return {
    '@type': 'Person',
    name: profile.fullName,
    jobTitle: profile.headline,
    description: profile.intro,
    url: homeUrl(context, lang),
    ...(profile.location
      ? { homeLocation: { '@type': 'Place', name: profile.location } }
      : {}),
    sameAs: profile.socials.map((social) => social.url),
  }
}

/** Home: the site itself, and who it belongs to. */
export function homeData(context: SiteContext, lang: Language): JsonLd[] {
  return [
    {
      '@context': SCHEMA,
      '@type': 'WebSite',
      name: context.siteSettings.siteName,
      url: homeUrl(context, lang),
      inLanguage: lang,
      author: person(context, lang),
    },
    { '@context': SCHEMA, ...person(context, lang) },
  ]
}

/** About: a profile page, about the site's owner. */
export function profilePageData(
  context: SiteContext,
  lang: Language,
  url: string,
): JsonLd {
  return {
    '@context': SCHEMA,
    '@type': 'ProfilePage',
    url,
    inLanguage: lang,
    mainEntity: person(context, lang),
  }
}

/** An article. Its topics go in `keywords`. */
export function blogPostingData(
  context: SiteContext,
  lang: Language,
  article: {
    url: string
    title: string
    description: string | null
    publishedDate: string
    updatedDate: string | null
    imageUrl: string
    topics: string[]
  },
): JsonLd {
  return {
    '@context': SCHEMA,
    '@type': 'BlogPosting',
    headline: article.title,
    ...(article.description ? { description: article.description } : {}),
    datePublished: article.publishedDate,
    ...(article.updatedDate ? { dateModified: article.updatedDate } : {}),
    image: article.imageUrl,
    inLanguage: lang,
    url: article.url,
    mainEntityOfPage: article.url,
    keywords: article.topics,
    author: {
      '@type': 'Person',
      name: context.profile.fullName,
      url: homeUrl(context, lang),
    },
  }
}

/**
 * Where a page sits, from Home down (Home › Blog › An article): Google can
 * show it in place of the bare address in its results.
 */
export function breadcrumbData(
  context: SiteContext,
  lang: Language,
  /** The pages after Home, by their address after the language ('/blog'). */
  trail: { name: string; path: string }[],
): JsonLd {
  const items = [{ name: context.siteSettings.siteName, path: '' }, ...trail]
  return {
    '@context': SCHEMA,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${homeUrl(context, lang)}${item.path}`,
    })),
  }
}
