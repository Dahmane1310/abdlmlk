import { createFileRoute } from '@tanstack/react-router'

import { ProjectsPage } from '@/features/projects/components/projects-page'
import { projectsQuery } from '@/features/projects/projects.queries'
import { projectsSearchSchema } from '@/features/projects/projects.schema'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { pageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/$lang/projects/')({
  validateSearch: projectsSearchSchema,
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...projectsQuery(params.lang),
      staleTime: 'static',
    }),
  // The filters (?type=) aren't part of the canonical address: the list is
  // the same page, however it's filtered.
  head: ({ match, params }) => {
    const t = dictionaries[params.lang]
    return pageHead({
      context: match.context,
      lang: params.lang,
      path: '/projects',
      title: `${t.projects.title} — ${match.context.siteSettings.siteName}`,
      description: t.projects.description,
    })
  },
  component: ProjectsPage,
})
