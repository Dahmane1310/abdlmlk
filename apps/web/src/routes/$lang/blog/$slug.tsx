import { createFileRoute } from '@tanstack/react-router'

import { NotFoundPage } from '@/components/layout/not-found-page'
import { articleQuery, articlesQuery } from '@/features/blog/blog.queries'
import { ArticlePage } from '@/features/blog/components/article-page'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { pageHead } from '@/lib/seo/page-head'
import { blogPostingData, breadcrumbData } from '@/lib/seo/structured-data'

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
    // Only what the head needs: the rest is in the query cache.
    return {
      title: article.title,
      description: article.description,
      seo: article.seo,
      cover: article.cover,
      languages: article.languages,
      publishedDate: article.publishedDate,
      updatedDate: article.updatedDate,
      topics: article.tags.map((tag) => tag.name),
    }
  },
  head: ({ loaderData, match, params }) => {
    if (!loaderData) return {}
    const siteName = match.context.siteSettings.siteName
    const path = `/blog/${params.slug}`
    return pageHead({
      context: match.context,
      lang: params.lang,
      path,
      title: loaderData.seo?.metaTitle ?? `${loaderData.title} — ${siteName}`,
      description: loaderData.seo?.metaDescription ?? loaderData.description,
      image: loaderData.seo?.shareImage ?? loaderData.cover,
      type: 'article',
      languages: loaderData.languages,
      article: {
        publishedTime: loaderData.publishedDate,
        modifiedTime: loaderData.updatedDate,
      },
      structuredData: ({ url, image }) => [
        blogPostingData(match.context, params.lang, {
          url,
          title: loaderData.title,
          description: loaderData.description,
          publishedDate: loaderData.publishedDate,
          updatedDate: loaderData.updatedDate,
          imageUrl: image.url,
          topics: loaderData.topics,
        }),
        breadcrumbData(match.context, params.lang, [
          { name: dictionaries[params.lang].nav.blog, path: '/blog' },
          { name: loaderData.title, path },
        ]),
      ],
    })
  },
  component: ArticlePage,
  // As on project pages: a notFound() from the loader renders here, inside
  // the site layout, instead of replacing it.
  notFoundComponent: NotFoundPage,
})
