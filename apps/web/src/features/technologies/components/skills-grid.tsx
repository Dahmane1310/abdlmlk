import { TechList } from '@/components/content/tech-list'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { SkillGroup } from '../technologies.functions'

/** One card per category, its technologies as logo chips. */
export function SkillsGrid({ groups }: { groups: SkillGroup[] }) {
  const t = useTranslation()

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <li key={group.category} className="rounded-xl border bg-card p-5">
          <h3 className="mb-4 mono-label">
            {t.technologies.categories[group.category]}
          </h3>
          <TechList technologies={group.technologies} />
        </li>
      ))}
    </ul>
  )
}
