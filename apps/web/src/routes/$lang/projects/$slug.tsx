import { createFileRoute } from '@tanstack/react-router'

import { NotFoundPage } from '@/components/layout/not-found-page'
import { ProjectPage } from '@/features/projects/components/project-page'
import {
  projectQuery,
  projectsQuery,
} from '@/features/projects/projects.queries'

export const Route = createFileRoute('/$lang/projects/$slug')({
  // The list is loaded too, for the previous/next links (usually already cached).
  // An unknown slug makes getProject throw notFound(), handled by this route's
  // notFoundComponent below.
  loader: async ({ context, params }) => {
    const [project] = await Promise.all([
      context.queryClient.query({
        ...projectQuery(params.lang, params.slug),
        staleTime: 'static',
      }),
      context.queryClient.query({
        ...projectsQuery(params.lang),
        staleTime: 'static',
      }),
    ])
    return { title: project.title, summary: project.summary, seo: project.seo }
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) return {}
    const siteName = match.context.siteSettings.siteName
    return {
      meta: [
        {
          title:
            loaderData.seo?.metaTitle ?? `${loaderData.title} — ${siteName}`,
        },
        {
          name: 'description',
          content: loaderData.seo?.metaDescription ?? loaderData.summary,
        },
      ],
    }
  },
  component: ProjectPage,
  // Needed here, not just on /$lang: a notFound() from a loader is caught by the
  // nearest route with a notFoundComponent, which renders in place of that
  // route's component. Caught by /$lang, it would replace the whole site layout.
  notFoundComponent: NotFoundPage,
})
