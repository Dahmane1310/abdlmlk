import { createFileRoute } from '@tanstack/react-router'

import { blogSearchSchema } from '@/features/blog/blog.schema'
import { articlesQuery } from '@/features/blog/blog.queries'
import { BlogPage } from '@/features/blog/components/blog-page'
import { dictionaries } from '@/lib/i18n/dictionaries'

export const Route = createFileRoute('/$lang/blog/')({
  validateSearch: blogSearchSchema,
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...articlesQuery(params.lang),
      staleTime: 'static',
    }),
  head: ({ match, params }) => {
    const t = dictionaries[params.lang]
    return {
      meta: [
        { title: `${t.nav.blog} — ${match.context.siteSettings.siteName}` },
        { name: 'description', content: t.blog.description },
      ],
    }
  },
  component: BlogPage,
})
