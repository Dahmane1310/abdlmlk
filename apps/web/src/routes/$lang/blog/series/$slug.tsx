import { createFileRoute } from '@tanstack/react-router'

import { NotFoundPage } from '@/components/layout/not-found-page'
import { articlesQuery, seriesQuery } from '@/features/blog/blog.queries'
import { SeriesPage } from '@/features/blog/components/series-page'
import { pageHead } from '@/lib/seo/page-head'

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
    return {
      title: series.title,
      description: series.description,
      languages: series.languages,
    }
  },
  head: ({ loaderData, match, params }) => {
    if (!loaderData) return {}
    return pageHead({
      context: match.context,
      lang: params.lang,
      path: `/blog/series/${params.slug}`,
      title: `${loaderData.title} — ${match.context.siteSettings.siteName}`,
      description: loaderData.description,
      languages: loaderData.languages,
    })
  },
  component: SeriesPage,
  // As on article pages: a notFound() from the loader renders here, inside
  // the site layout, instead of replacing it.
  notFoundComponent: NotFoundPage,
})
