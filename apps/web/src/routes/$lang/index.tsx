import { createFileRoute } from '@tanstack/react-router'

import { careerQuery } from '@/features/career/career.queries'
import { HomePage } from '@/features/home/components/home-page'
import { newsletterSearchSchema } from '@/features/newsletter/newsletter.schema'
import { profileQuery } from '@/features/profile/profile.queries'
import { projectsQuery } from '@/features/projects/projects.queries'
import { servicesQuery } from '@/features/services/services.queries'
import { pageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/$lang/')({
  // ?newsletter= from the links in the newsletter's emails.
  validateSearch: newsletterSearchSchema,
  // The layout loads the profile too; the page still declares what it needs.
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.query({
        ...profileQuery(params.lang),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...projectsQuery(params.lang),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...servicesQuery(params.lang),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...careerQuery(params.lang),
        staleTime: 'static',
      }),
    ])
  },
  // The site's own title and description, from the CMS's Site settings.
  head: ({ match, params }) => {
    const { siteSettings } = match.context
    return pageHead({
      context: match.context,
      lang: params.lang,
      path: '',
      title: siteSettings.defaultSeo?.metaTitle ?? siteSettings.siteName,
      description: siteSettings.defaultSeo?.metaDescription,
    })
  },
  component: HomePage,
})
