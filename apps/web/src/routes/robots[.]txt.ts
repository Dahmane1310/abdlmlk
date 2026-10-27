import { createFileRoute } from '@tanstack/react-router'

import { getSiteUrl } from '@/features/site/site.functions'

// /robots.txt: everything may be crawled, and here is the sitemap. A route
// rather than a file in public/, because the sitemap's address needs SITE_URL.
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          [
            'User-agent: *',
            'Allow: /',
            '',
            `Sitemap: ${await getSiteUrl()}/sitemap.xml`,
            '',
          ].join('\n'),
          {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'public, max-age=3600',
            },
          },
        ),
    },
  },
})
