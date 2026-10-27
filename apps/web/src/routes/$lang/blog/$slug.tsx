import { createFileRoute } from '@tanstack/react-router'

import { NotFoundPage } from '@/components/layout/not-found-page'
import { articleQuery, articlesQuery } from '@/features/blog/blog.queries'
import { ArticlePage } from '@/features/blog/components/article-page'

export const Route = createFileRoute('/$lang/blog/$slug')({
  // An unknown slug makes getArticle throw notFound(), handled by this route's
  // notFoundComponent below.
  loader: async ({ context, params }) => {
    const [article] = await Promise.all([
      context.queryClient.query({
        ...articleQuery(params.lang, params.slug),
        staleTime: 'static',
      }),
      // For "More to read": the blog page's list, cached after a visit there.
      context.queryClient.query({
        ...articlesQuery(params.lang),
        staleTime: 'static',
      }),
    ])
    return {
      title: article.title,
      description: article.description,
      seo: article.seo,
    }
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const siteName = match.context.siteSettings.siteName
    const description =
      loaderData.seo?.metaDescription ?? loaderData.description
    return {
      meta: [
        {
          title:
            loaderData.seo?.metaTitle ?? `${loaderData.title} — ${siteName}`,
        },
        ...(description ? [{ name: 'description', content: description }] : []),
      ],
    }
  },
  component: ArticlePage,
  // As on project pages: a notFound() from the loader renders here, inside
  // the site layout, instead of replacing it.
  notFoundComponent: NotFoundPage,
})
