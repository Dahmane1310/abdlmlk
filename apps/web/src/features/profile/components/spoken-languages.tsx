import { SpecList, SpecRow } from '@/components/content/spec-list'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import type { SpokenLanguage } from '../profile.schema'

// How many of the meter's five steps each level fills.
const LEVEL_STEPS: Record<SpokenLanguage['level'], number> = {
  native: 5,
  fluent: 4,
  professional: 3,
  intermediate: 2,
  beginner: 1,
}

/**
 * Languages as spec rows (DESIGN.md, "Languages"): the name in the label
 * column, then the level in words, a five-step meter and the CEFR level.
 */
export function SpokenLanguages({
  languages,
}: {
  languages: SpokenLanguage[]
}) {
  const t = useTranslation()

  return (
    <SpecList>
      {languages.map((language) => (
        <SpecRow
          key={language.name}
          label={<p className="mono-label">{language.name}</p>}
        >
          {/* Fixed widths, so the meters line up from row to row. */}
          <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="w-32 text-[1.0625rem]">
              {t.profile.languageLevels[language.level]}
            </span>
            {/* Decorative: the level is written out beside it. */}
            <span aria-hidden className="flex w-40 gap-1">
              {Array.from({ length: 5 }, (_, step) => (
                <span
                  key={step}
                  className={cn(
                    'h-1.5 flex-1 rounded-full',
                    step < LEVEL_STEPS[language.level]
                      ? 'bg-primary'
                      : 'bg-border',
                  )}
                />
              ))}
            </span>
            {language.cefr && (
              <span className="font-mono text-[0.8125rem] text-muted-foreground">
                {language.cefr}
              </span>
            )}
          </p>
        </SpecRow>
      ))}
    </SpecList>
  )
}
