import { SpecList, SpecRow } from '@/components/content/spec-list'
import { TechList } from '@/components/content/tech-list'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { Career } from '../career.functions'
import { JobPeriod } from './job-period'
import { OrganizationLine } from './organization-line'

/**
 * Jobs as spec rows (DESIGN.md, "Experience"), newest first: the dates,
 * duration and a "Current" badge in the label column, then the role and
 * what the job involved.
 */
export function ExperienceList({
  jobs,
  brief = false,
}: {
  jobs: Career['experience']
  /** Home's summary: the role and company only; the rest stays on About. */
  brief?: boolean
}) {
  const t = useTranslation()

  return (
    <SpecList spacing="roomy">
      {jobs.map((job) => (
        <SpecRow key={job.documentId} label={<JobPeriod job={job} />}>
          <h3 className="text-xl leading-snug font-semibold">{job.role}</h3>
          <OrganizationLine
            organization={job.organization}
            details={[
              job.workMode && t.career.workModes[job.workMode],
              job.location,
            ]}
            className="mt-1"
          />
          {!brief && (
            <>
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
            </>
          )}
        </SpecRow>
      ))}
    </SpecList>
  )
}
