import { TechList } from '@/components/content/tech-list'
import { formatDateRange, formatDuration } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { Career } from '../career.functions'
import { Timeline, TimelineItem } from './timeline'

export function ExperienceList({ jobs }: { jobs: Career['experience'] }) {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <Timeline>
      {jobs.map((job) => (
        <TimelineItem
          key={job.documentId}
          period={formatDateRange(
            job.startDate,
            job.endDate,
            lang,
            t.dates.present,
          )}
          duration={formatDuration(job.months, lang)}
          current={job.endDate === null}
          title={job.role}
          organization={job.organization}
          meta={[
            job.employmentType && t.career.employmentTypes[job.employmentType],
            job.workMode && t.career.workModes[job.workMode],
            job.location,
          ]}
        >
          {job.summary && (
            <p className="text-muted-foreground">{job.summary}</p>
          )}
          {/* Rendered and sanitized on the server (lib/markdown). */}
          {job.achievementsHtml && (
            <div
              className="prose max-w-none prose-li:marker:text-primary"
              dangerouslySetInnerHTML={{ __html: job.achievementsHtml }}
            />
          )}
          <TechList technologies={job.technologies} className="mt-1" />
        </TimelineItem>
      ))}
    </Timeline>
  )
}
