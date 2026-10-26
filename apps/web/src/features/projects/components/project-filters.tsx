import { Link } from '@tanstack/react-router'

import { STRIP_CELL_CLASS, STRIP_CLASS } from '@/components/content/strip'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import { projectTypeSchema } from '../projects.schema'
import type { ProjectSummary } from '../projects.functions'
import type { ProjectType } from '../projects.schema'

/**
 * The project types in use, with how many projects each. Null when there's
 * only one, since there's nothing to choose between: the page then leaves
 * the filters' band out.
 */
export function getFilterOptions(projects: ProjectSummary[]) {
  const types = projectTypeSchema.options
    .map((type) => ({
      type,
      count: projects.filter((project) => project.projectType === type).length,
    }))
    .filter(({ count }) => count > 0)

  if (types.length < 2) return null

  return { total: projects.length, types }
}

type FilterOptions = NonNullable<ReturnType<typeof getFilterOptions>>

/**
 * One type in the strip (DESIGN.md, "Projects filters"): its label and how
 * many projects it has. The whole cell is a link, so a filtered view is
 * shareable and works with the back button. The chosen one is blue with a
 * 2px line along its bottom edge.
 */
function TypeCell({
  label,
  count,
  type,
}: {
  label: string
  count: number
  /** Undefined for "All". */
  type: ProjectType | undefined
}) {
  return (
    <li
      className={cn(
        STRIP_CELL_CLASS,
        'relative has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-inset',
      )}
    >
      <Link
        from="/$lang/projects/"
        to="."
        search={{ type }}
        // Exact: "All" is only active when no type is set.
        activeOptions={{ exact: true }}
        resetScroll={false}
        className="group flex flex-col gap-2 text-muted-foreground outline-none after:absolute after:inset-0 hover:text-foreground data-[status=active]:text-primary data-[status=active]:before:absolute data-[status=active]:before:inset-x-0 data-[status=active]:before:bottom-0 data-[status=active]:before:h-0.5 data-[status=active]:before:bg-primary"
      >
        <span className="mono-label group-hover:text-foreground group-data-[status=active]:text-primary">
          {label}
        </span>
        <span className="font-mono text-4xl font-medium tracking-tight text-foreground group-data-[status=active]:text-primary">
          {count}
        </span>
      </Link>
    </li>
  )
}

/**
 * The projects page's filter: the types with their counts as a strip, in
 * the header's transition band.
 */
export function ProjectFilters({ options }: { options: FilterOptions }) {
  const t = useTranslation()

  return (
    <nav aria-label={t.projects.filters}>
      <ul className={STRIP_CLASS}>
        <TypeCell
          label={t.projects.all}
          count={options.total}
          type={undefined}
        />
        {options.types.map(({ type, count }) => (
          <TypeCell
            key={type}
            label={t.projects.types[type]}
            count={count}
            type={type}
          />
        ))}
      </ul>
    </nav>
  )
}
