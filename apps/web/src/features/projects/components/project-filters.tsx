import { Link } from '@tanstack/react-router'

import { useTranslation } from '@/lib/i18n/use-translation'

import { projectTypeSchema } from '../projects.schema'
import type { ProjectsSearch, ProjectSummary } from '../projects.schema'

/** A filter is a link, so filtered views are shareable and work with the back button. */
function FilterChip({
  search,
  children,
}: {
  search: (previous: ProjectsSearch) => ProjectsSearch
  children: React.ReactNode
}) {
  return (
    <Link
      from="/$lang/projects/"
      to="."
      search={search}
      // Exact: "All" is only active when no value of this filter is set.
      activeOptions={{ exact: true }}
      resetScroll={false}
      className="inline-flex rounded-md border px-3 py-1 font-mono text-xs text-muted-foreground hover:border-input hover:text-foreground data-[status=active]:border-primary data-[status=active]:bg-primary/10 data-[status=active]:text-foreground"
    >
      {children}
    </Link>
  )
}

function FilterGroup({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p id={id} className="w-28 shrink-0 text-sm text-muted-foreground">
        {label}
      </p>
      <ul aria-labelledby={id} className="flex flex-wrap gap-2">
        {children}
      </ul>
    </div>
  )
}

/** Type and technology filters, built from what the listed projects actually use. */
export function ProjectFilters({ projects }: { projects: ProjectSummary[] }) {
  const t = useTranslation()

  const types = projectTypeSchema.options.filter((type) =>
    projects.some((project) => project.projectType === type),
  )
  const technologies = [
    ...new Map(
      projects
        .flatMap((project) => project.technologies)
        .map((technology) => [technology.slug, technology]),
    ).values(),
  ].sort((a, b) => a.name.localeCompare(b.name))

  if (types.length < 2 && technologies.length === 0) return null

  return (
    <nav aria-label={t.projects.filters} className="flex flex-col gap-3">
      {types.length > 1 && (
        <FilterGroup id="filter-type" label={t.projects.type}>
          <li>
            <FilterChip
              search={(previous) => ({ ...previous, type: undefined })}
            >
              {t.projects.all}
            </FilterChip>
          </li>
          {types.map((type) => (
            <li key={type}>
              <FilterChip search={(previous) => ({ ...previous, type })}>
                {t.projects.types[type]}
              </FilterChip>
            </li>
          ))}
        </FilterGroup>
      )}
      {technologies.length > 0 && (
        <FilterGroup id="filter-technology" label={t.projects.technology}>
          <li>
            <FilterChip
              search={(previous) => ({ ...previous, tech: undefined })}
            >
              {t.projects.all}
            </FilterChip>
          </li>
          {technologies.map((technology) => (
            <li key={technology.slug}>
              <FilterChip
                search={(previous) => ({ ...previous, tech: technology.slug })}
              >
                {technology.name}
              </FilterChip>
            </li>
          ))}
        </FilterGroup>
      )}
    </nav>
  )
}
