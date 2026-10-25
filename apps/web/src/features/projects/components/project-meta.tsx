import { formatDateRange } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

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

  const items = [
    t.projects.types[project.projectType],
    project.client?.name ?? project.organization?.name,
    formatDateRange(
      project.startDate,
      project.endDate,
      lang,
      t.projects.present,
    ),
  ].filter((item) => item != null)

  return (
    // Separate items, so mixed Arabic and Latin text never reorders across them.
    // Each separator trails its item, so a wrapped line never starts with one.
    <p
      className={cn(
        'flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground',
        className,
      )}
    >
      {items.map((item, index) => (
        <span key={item} className="flex gap-x-2">
          {item}
          {index < items.length - 1 && <span aria-hidden>·</span>}
        </span>
      ))}
    </p>
  )
}
