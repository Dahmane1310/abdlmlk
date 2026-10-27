import { type Language, LANGUAGES } from '@/lib/i18n/config'
import type { Media } from '@/lib/strapi/schemas'

// Open Graph wants language_TERRITORY.
const OG_LOCALES: Record<Language, string> = {
  en: 'en_US',
  ar: 'ar_AR',
  fr: 'fr_FR',
}

/** What a share image needs: a CMS image, or one of the site's own cards. */
type ShareImage = Pick<Media, 'url' | 'width' | 'height' | 'alternativeText'>

// The site's own share cards (design/share-image.html), one per language, in
// public/share/.
const SHARE_CARD = { width: 1200, height: 630 }

interface PageSeo {
  /** The root route's context: the site's address, name and default image. */
  context: {
    siteUrl: string
    siteSettings: {
      siteName: string
      defaultSeo?: { metaTitle: string; shareImage: Media | null } | null
    }
  }
  lang: Language
  /** The page's address after the language: '' for Home, '/blog/an-article'. */
  path: string
  title: string
  description?: string | null
  /** The page's own image; the site's default otherwise (see shareImage). */
  image?: Media | null
  type?: 'website' | 'profile' | 'article'
  /** The languages the page exists in. All three unless it says otherwise. */
  languages?: readonly Language[]
  article?: { publishedTime: string; modifiedTime: string | null }
}

/**
 * What a page puts in <head> for search engines and link previews
 * (ARCHITECTURE.md, "SEO"): its title and description, its canonical address,
 * the same page in its other languages, and Open Graph tags, which LinkedIn,
 * X, WhatsApp and others read for a shared link's card. Every page route's
 * `head` returns this, so no page can leave something out.
 */
export function pageHead({
  context,
  lang,
  path,
  title,
  description,
  image,
  type = 'website',
  languages = LANGUAGES,
  article,
}: PageSeo) {
  const urlIn = (language: Language) => `${context.siteUrl}/${language}${path}`
  // The page's own image, then a default uploaded in the CMS, then the
  // site's card in the page's language.
  const shareImage: ShareImage = image ??
    context.siteSettings.defaultSeo?.shareImage ?? {
      url: `${context.siteUrl}/share/${lang}.png`,
      ...SHARE_CARD,
      alternativeText:
        context.siteSettings.defaultSeo?.metaTitle ??
        context.siteSettings.siteName,
    }

  return {
    meta: [
      { title },
      ...(description
        ? [
            { name: 'description', content: description },
            { property: 'og:description', content: description },
          ]
        : []),
      { property: 'og:title', content: title },
      { property: 'og:site_name', content: context.siteSettings.siteName },
      { property: 'og:url', content: urlIn(lang) },
      { property: 'og:type', content: type },
      // No og:locale:alternate or article:tag: the router keeps one meta tag
      // per name or property, and those repeat. The hreflang links below
      // name the other languages; the topics go in the structured data.
      { property: 'og:locale', content: OG_LOCALES[lang] },
      { property: 'og:image', content: shareImage.url },
      ...(shareImage.width && shareImage.height
        ? [
            { property: 'og:image:width', content: String(shareImage.width) },
            { property: 'og:image:height', content: String(shareImage.height) },
          ]
        : []),
      ...(shareImage.alternativeText
        ? [{ property: 'og:image:alt', content: shareImage.alternativeText }]
        : []),
      // X falls back to the og: tags, but not every preview tool does, so its
      // own are spelled out too. (No twitter:url: X doesn't read it.)
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      ...(description
        ? [{ name: 'twitter:description', content: description }]
        : []),
      { name: 'twitter:image', content: shareImage.url },
      ...(shareImage.alternativeText
        ? [{ name: 'twitter:image:alt', content: shareImage.alternativeText }]
        : []),
      ...(article
        ? [
            {
              property: 'article:published_time',
              content: article.publishedTime,
            },
            ...(article.modifiedTime
              ? [
                  {
                    property: 'article:modified_time',
                    content: article.modifiedTime,
                  },
                ]
              : []),
          ]
        : []),
    ],
    links: [
      { rel: 'canonical', href: urlIn(lang) },
      ...languages.map((language) => ({
        rel: 'alternate',
        hrefLang: language,
        href: urlIn(language),
      })),
      // For readers of any other language: English, the site's default.
      ...(languages.includes('en')
        ? [{ rel: 'alternate', hrefLang: 'x-default', href: urlIn('en') }]
        : []),
    ],
  }
}
