import { createFileRoute } from '@tanstack/react-router'

import { ProjectsPage } from '@/features/projects/components/projects-page'
import { projectsQuery } from '@/features/projects/projects.queries'
import { projectsSearchSchema } from '@/features/projects/projects.schema'
import { dictionaries } from '@/lib/i18n/dictionaries'

export const Route = createFileRoute('/$lang/projects/')({
  validateSearch: projectsSearchSchema,
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...projectsQuery(params.lang),
      staleTime: 'static',
    }),
  head: ({ match, params }) => {
    const t = dictionaries[params.lang]
    return {
      meta: [
        {
          title: `${t.projects.title} — ${match.context.siteSettings.siteName}`,
        },
        { name: 'description', content: t.projects.description },
      ],
    }
  },
  component: ProjectsPage,
})
