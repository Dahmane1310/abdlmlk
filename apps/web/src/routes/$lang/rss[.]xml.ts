import { createFileRoute, isNotFound } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

import { getServerEnv } from '@/env.server'
import { getArticles } from '@/features/blog/blog.functions'
import { buildRssFeed } from '@/features/blog/rss.server'
import { getSiteSettings } from '@/features/site/site.functions'
import { dictionaries } from '@/lib/i18n/dictionaries'

// The $lang layout rejects an unknown language with the router's "not found",
// which pages turn into a 404 but a file route would answer with a 500.
const notFoundAs404 = createMiddleware({ type: 'request' }).server(
  async ({ next }) => {
    try {
      return await next()
    } catch (error) {
      if (isNotFound(error)) return new Response('Not found', { status: 404 })
      throw error
    }
  },
)

// /en/rss.xml, /ar/rss.xml, /fr/rss.xml: an XML file, not a page.
export const Route = createFileRoute('/$lang/rss.xml')({
  server: {
    middleware: [notFoundAs404],
    handlers: {
      GET: async ({ request, params }) => {
        const [articles, siteSettings] = await Promise.all([
          getArticles({ data: { lang: params.lang } }),
          getSiteSettings({ data: { lang: params.lang } }),
        ])
        const t = dictionaries[params.lang]
        const xml = buildRssFeed({
          // Without SITE_URL (locally), the address the request came in on.
          siteUrl: getServerEnv().siteUrl ?? new URL(request.url).origin,
          lang: params.lang,
          title: `${t.blog.title} — ${siteSettings.siteName}`,
          description: t.blog.description,
          articles,
        })

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            // Feed readers check often; an hour is fresh enough for a blog.
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
