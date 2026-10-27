import { createFileRoute } from '@tanstack/react-router'

import { AboutPage } from '@/features/about/components/about-page'
import { careerQuery } from '@/features/career/career.queries'
import { spokenLanguagesQuery } from '@/features/profile/profile.queries'
import { skillsQuery } from '@/features/technologies/technologies.queries'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { pageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/$lang/about')({
  // The base profile is already loaded for the layout by the root route.
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.query({
        ...spokenLanguagesQuery(params.lang),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...careerQuery(params.lang),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...skillsQuery(params.lang),
        staleTime: 'static',
      }),
    ])
  },
  head: ({ match, params }) => {
    const t = dictionaries[params.lang]
    return pageHead({
      context: match.context,
      lang: params.lang,
      path: '/about',
      title: `${t.about.title} — ${match.context.siteSettings.siteName}`,
      description: t.about.description,
      type: 'profile',
    })
  },
  component: AboutPage,
})
