import { createFileRoute } from '@tanstack/react-router'

import { blogSearchSchema } from '@/features/blog/blog.schema'
import { articlesQuery } from '@/features/blog/blog.queries'
import { BlogPage } from '@/features/blog/components/blog-page'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { pageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/$lang/blog/')({
  validateSearch: blogSearchSchema,
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...articlesQuery(params.lang),
      staleTime: 'static',
    }),
  // As for projects: the topic filter (?tag=) isn't part of the canonical address.
  head: ({ match, params }) => {
    const t = dictionaries[params.lang]
    return pageHead({
      context: match.context,
      lang: params.lang,
      path: '/blog',
      title: `${t.nav.blog} — ${match.context.siteSettings.siteName}`,
      description: t.blog.description,
    })
  },
  component: BlogPage,
})
