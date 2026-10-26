import { ArrowLink } from '@/components/content/arrow-link'
import { PageSection } from '@/components/layout/page-section'
import { FeaturedProjectCard } from '@/features/projects/components/featured-project-card'
import { ProjectCard } from '@/features/projects/components/project-card'
import type { ProjectSummary } from '@/features/projects/projects.functions'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

/** The id the hero's "See my work" link jumps to. */
export const SELECTED_WORK_ID = 'selected-work'

/**
 * The featured projects (DESIGN.md, "Featured card"): the first one wide,
 * the others as cards in a row, and a link to all projects.
 */
export function SelectedWork({ projects }: { projects: ProjectSummary[] }) {
  const t = useTranslation()
  const lang = useLanguage()
  // .at() is typed as possibly undefined, so the empty check is real to TypeScript.
  const first = projects.at(0)
  const others = projects.slice(1)

  if (!first) return null

  return (
    <PageSection
      id={SELECTED_WORK_ID}
      title={t.home.selectedWork}
      action={
        <ArrowLink to="/$lang/projects" params={{ lang }}>
          {t.home.allProjects}
        </ArrowLink>
      }
    >
      <div className="flex flex-col gap-6">
        <FeaturedProjectCard project={first} />
        {others.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} headingLevel="h3" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageSection>
  )
}
