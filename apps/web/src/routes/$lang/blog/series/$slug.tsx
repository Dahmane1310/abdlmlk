import { createFileRoute } from '@tanstack/react-router'

import { NotFoundPage } from '@/components/layout/not-found-page'
import { articlesQuery, seriesQuery } from '@/features/blog/blog.queries'
import { SeriesPage } from '@/features/blog/components/series-page'

export const Route = createFileRoute('/$lang/blog/series/$slug')({
  // An unknown slug makes getSeries throw notFound(), handled by this route's
  // notFoundComponent below. The parts come from the blog's article list.
  loader: async ({ context, params }) => {
    const [series] = await Promise.all([
      context.queryClient.query({
        ...seriesQuery(params.lang, params.slug),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...articlesQuery(params.lang),
        staleTime: 'static',
      }),
    ])
    return { title: series.title, description: series.description }
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const siteName = match.context.siteSettings.siteName
    return {
      meta: [
        { title: `${loaderData.title} — ${siteName}` },
        ...(loaderData.description
          ? [{ name: 'description', content: loaderData.description }]
          : []),
      ],
    }
  },
  component: SeriesPage,
  // As on article pages: a notFound() from the loader renders here, inside
  // the site layout, instead of replacing it.
  notFoundComponent: NotFoundPage,
})
