import { createFileRoute } from '@tanstack/react-router'

import { getSiteUrl } from '@/features/site/site.functions'
import { buildSitemap } from '@/lib/seo/sitemap.server'

// /sitemap.xml: every page in every language, for search engines.
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () =>
        new Response(await buildSitemap(await getSiteUrl()), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            // Search engines read it now and then; an hour is fresh enough.
            'Cache-Control': 'public, max-age=3600',
          },
        }),
    },
  },
})
