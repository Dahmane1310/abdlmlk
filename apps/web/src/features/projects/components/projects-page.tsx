import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'

import { Page } from '@/components/layout/page'
import { PageHeader } from '@/components/layout/page-header'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { projectsQuery } from '../projects.queries'
import { ProjectCard } from './project-card'
import { getFilterOptions, ProjectFilters } from './project-filters'

const routeApi = getRouteApi('/$lang/projects/')

export function ProjectsPage() {
  const t = useTranslation()
  const lang = useLanguage()
  const { type } = routeApi.useSearch()
  const { data: projects } = useSuspenseQuery(projectsQuery(lang))
  const filterOptions = getFilterOptions(projects)

  // Few enough projects to filter here, without another request per filter.
  const visible = projects.filter(
    (project) => !type || project.projectType === type,
  )

  return (
    <Page
      header={
        <PageHeader
          eyebrow={t.projects.eyebrow}
          title={t.projects.title}
          lead={t.projects.description}
          strip={filterOptions && <ProjectFilters options={filterOptions} />}
        />
      }
    >
      {visible.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2">
          {visible.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-xl border p-8">
          <p className="text-muted-foreground">{t.projects.empty}</p>
          <Link
            from="/$lang/projects/"
            to="."
            search={{}}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {t.projects.showAll}
          </Link>
        </div>
      )}
    </Page>
  )
}
