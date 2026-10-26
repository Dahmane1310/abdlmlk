import { SpecList, SpecRow } from '@/components/content/spec-list'
import { TechList } from '@/components/content/tech-list'
import { formatDateRange, formatDuration } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { Career } from '../career.functions'
import { OrganizationLine } from './organization-line'

/**
 * Jobs as spec rows (DESIGN.md, "Experience"), newest first: the dates,
 * duration and a "Current" badge in the label column, then the role and
 * what the job involved.
 */
export function ExperienceList({ jobs }: { jobs: Career['experience'] }) {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <SpecList spacing="roomy">
      {jobs.map((job) => {
        const duration = formatDuration(job.months, lang)

        return (
          <SpecRow
            key={job.documentId}
            label={
              <div className="flex flex-col items-start gap-1.5 font-mono text-[0.8125rem] text-muted-foreground">
                <p>
                  {formatDateRange(
                    job.startDate,
                    job.endDate,
                    lang,
                    t.dates.present,
                  )}
                </p>
                {duration && <p>{duration}</p>}
                {job.endDate === null && (
                  <p className="mt-1 rounded-sm border border-primary px-1.5 text-[0.6875rem] leading-4.5 text-primary">
                    {t.career.current}
                  </p>
                )}
              </div>
            }
          >
            <h3 className="text-xl leading-snug font-semibold">{job.role}</h3>
            <OrganizationLine
              organization={job.organization}
              details={[
                job.workMode && t.career.workModes[job.workMode],
                job.location,
              ]}
              className="mt-1"
            />
            {job.summary && (
              <p className="mt-4 text-[1.0625rem]">{job.summary}</p>
            )}
            {/* Rendered and sanitized on the server (lib/markdown). */}
            {job.achievementsHtml && (
              <div
                className="square-bullets prose mt-4 max-w-none [&_li]:my-2"
                dangerouslySetInnerHTML={{ __html: job.achievementsHtml }}
              />
            )}
            <TechList technologies={job.technologies} className="mt-5" />
          </SpecRow>
        )
      })}
    </SpecList>
  )
}
