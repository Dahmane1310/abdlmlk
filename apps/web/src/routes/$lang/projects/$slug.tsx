import { createFileRoute } from '@tanstack/react-router'

import { NotFoundPage } from '@/components/layout/not-found-page'
import { ProjectPage } from '@/features/projects/components/project-page'
import {
  projectQuery,
  projectsQuery,
} from '@/features/projects/projects.queries'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { pageHead } from '@/lib/seo/page-head'
import { breadcrumbData } from '@/lib/seo/structured-data'

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
    // Only what the head needs: the rest is in the query cache.
    return {
      title: project.title,
      summary: project.summary,
      seo: project.seo,
      cover: project.cover,
      languages: project.languages,
    }
  },
  head: ({ loaderData, match, params }) => {
    if (!loaderData) return {}
    const siteName = match.context.siteSettings.siteName
    const path = `/projects/${params.slug}`
    return pageHead({
      context: match.context,
      lang: params.lang,
      path,
      title: loaderData.seo?.metaTitle ?? `${loaderData.title} — ${siteName}`,
      description: loaderData.seo?.metaDescription ?? loaderData.summary,
      image: loaderData.seo?.shareImage ?? loaderData.cover,
      languages: loaderData.languages,
      structuredData: () => [
        breadcrumbData(match.context, params.lang, [
          { name: dictionaries[params.lang].nav.projects, path: '/projects' },
          { name: loaderData.title, path },
        ]),
      ],
    })
  },
  component: ProjectPage,
  // Needed here, not just on /$lang: a notFound() from a loader is caught by the
  // nearest route with a notFoundComponent, which renders in place of that
  // route's component. Caught by /$lang, it would replace the whole site layout.
  notFoundComponent: NotFoundPage,
})
