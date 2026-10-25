import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'

import { Container } from '@/components/layout/container'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { projectsQuery } from '../projects.queries'
import { ProjectCard } from './project-card'
import { ProjectFilters } from './project-filters'

const routeApi = getRouteApi('/$lang/projects/')

export function ProjectsPage() {
  const t = useTranslation()
  const lang = useLanguage()
  const { type, tech } = routeApi.useSearch()
  const { data: projects } = useSuspenseQuery(projectsQuery(lang))

  // Few enough projects to filter here, without another request per filter.
  const visible = projects.filter(
    (project) =>
      (!type || project.projectType === type) &&
      (!tech || project.technologies.some(({ slug }) => slug === tech)),
  )

  return (
    <Container className="flex flex-col gap-10 py-16 md:py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t.projects.title}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {t.projects.description}
        </p>
      </header>

      <ProjectFilters projects={projects} />

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
    </Container>
  )
}
