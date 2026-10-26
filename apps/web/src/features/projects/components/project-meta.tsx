import { MetaLine } from '@/components/content/meta-line'
import { formatYearRange } from '@/lib/i18n/format'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { ProjectSummary } from '../projects.functions'

/**
 * "Client project · 2024": the type and years, short enough for one line on
 * a card (DESIGN.md, "Project card"). The client and exact dates are on the
 * project's page.
 */
export function ProjectMeta({
  project,
  className,
}: {
  project: ProjectSummary
  className?: string
}) {
  const t = useTranslation()

  return (
    <MetaLine
      className={className}
      items={[
        t.projects.types[project.projectType],
        formatYearRange(project.startDate, project.endDate, t.dates.present),
      ]}
    />
  )
}
