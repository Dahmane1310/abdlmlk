import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/features/home/components/home-page'
import { profileQuery } from '@/features/profile/profile.queries'

export const Route = createFileRoute('/$lang/')({
  // The layout loads the profile too; the page still declares what it needs.
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...profileQuery(params.lang),
      staleTime: 'static',
    }),
  component: HomePage,
})
