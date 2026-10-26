import { SpecList, SpecRow } from '@/components/content/spec-list'
import { TechList } from '@/components/content/tech-list'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { SkillGroup } from '../technologies.functions'

/**
 * Skills as spec rows (DESIGN.md, "Skills"): the category in the label
 * column, then its technologies with their logos.
 */
export function SkillsList({ groups }: { groups: SkillGroup[] }) {
  const t = useTranslation()

  return (
    <SpecList>
      {groups.map((group) => (
        <SpecRow
          key={group.category}
          label={
            <h3 className="mono-label">
              {t.technologies.categories[group.category]}
            </h3>
          }
        >
          <TechList technologies={group.technologies} size="lg" />
        </SpecRow>
      ))}
    </SpecList>
  )
}
