import { createFileRoute } from '@tanstack/react-router'

import { careerQuery } from '@/features/career/career.queries'
import { HomePage } from '@/features/home/components/home-page'
import { profileQuery } from '@/features/profile/profile.queries'
import { projectsQuery } from '@/features/projects/projects.queries'
import { servicesQuery } from '@/features/services/services.queries'

export const Route = createFileRoute('/$lang/')({
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
  component: HomePage,
})
