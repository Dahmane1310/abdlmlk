import { MetaLine } from '@/components/content/meta-line'
import { formatDateRange } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { ProjectSummary } from '../projects.schema'

/** "Client project · Ayama · Aug 2024 — Dec 2024" */
export function ProjectMeta({
  project,
  className,
}: {
  project: ProjectSummary
  className?: string
}) {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <MetaLine
      className={className}
      items={[
        t.projects.types[project.projectType],
        project.client?.name ?? project.organization?.name,
        formatDateRange(
          project.startDate,
          project.endDate,
          lang,
          t.dates.present,
        ),
      ]}
    />
  )
}
