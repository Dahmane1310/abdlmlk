import type { Fact } from '@/components/content/facts-strip'
import type { Career } from '@/features/career/career.functions'
import type { SpokenLanguage } from '@/features/profile/profile.schema'
import { formatDuration } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

/**
 * The online CV at a glance (DESIGN.md, "About header"): total experience,
 * the current job, the latest degree and the spoken languages, all worked
 * out from the sections below. Facts without data are left out.
 */
export function useCvFacts({
  career,
  languages,
}: {
  career: Career
  languages: SpokenLanguage[]
}): Fact[] {
  const t = useTranslation()
  const lang = useLanguage()

  // The jobs' own durations added up, so gaps between jobs don't count.
  const months = career.experience.reduce((sum, job) => sum + job.months, 0)
  const currentJob = career.experience.find((job) => job.endDate === null)
  // Listed newest first, like the Education section.
  const degree = career.education.at(0)

  return [
    months > 0
      ? { label: t.about.experience, value: formatDuration(months, lang) }
      : null,
    currentJob
      ? {
          label: t.about.currently,
          value: (
            <>
              {currentJob.role}
              {currentJob.organization && (
                <span className="block text-muted-foreground">
                  {currentJob.organization.name}
                </span>
              )}
            </>
          ),
        }
      : null,
    degree
      ? {
          label: t.about.education,
          value: (
            <>
              {degree.degree}
              {degree.field && (
                <span className="block text-muted-foreground">
                  {degree.field}
                </span>
              )}
            </>
          ),
        }
      : null,
    languages.length > 0
      ? {
          label: t.about.spokenLanguages,
          value: languages.map((language) => language.name).join(' · '),
        }
      : null,
  ].filter((fact) => fact != null)
}
