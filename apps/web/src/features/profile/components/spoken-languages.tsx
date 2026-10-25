import { MetaLine } from '@/components/content/meta-line'
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

/** One card per language: its name, a five-step level meter and the level in words. */
export function SpokenLanguages({
  languages,
}: {
  languages: SpokenLanguage[]
}) {
  const t = useTranslation()

  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {languages.map((language) => (
        <div key={language.name} className="rounded-xl border bg-card p-5">
          <dt className="font-medium">{language.name}</dt>
          <dd className="mt-4 flex flex-col gap-2">
            {/* Decorative: the level is written out right below. */}
            <span aria-hidden className="flex gap-1">
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
            <MetaLine
              items={[t.profile.languageLevels[language.level], language.cefr]}
            />
          </dd>
        </div>
      ))}
    </dl>
  )
}
