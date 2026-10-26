import { formatDateRange, formatDuration } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { Career } from '../career.functions'

/**
 * A job's label column (DESIGN.md, "Experience"): the dates, the duration and
 * a "Current" badge while it's ongoing. Shared by About and Home.
 */
export function JobPeriod({
  job,
}: {
  job: Pick<Career['experience'][number], 'startDate' | 'endDate' | 'months'>
}) {
  const t = useTranslation()
  const lang = useLanguage()
  const duration = formatDuration(job.months, lang)

  return (
    <div className="flex flex-col items-start gap-1.5 font-mono text-[0.8125rem] text-muted-foreground">
      <p>
        {formatDateRange(job.startDate, job.endDate, lang, t.dates.present)}
      </p>
      {duration && <p>{duration}</p>}
      {job.endDate === null && (
        <p className="mt-1 rounded-sm border border-primary px-1.5 text-[0.6875rem] leading-4.5 text-primary">
          {t.career.current}
        </p>
      )}
    </div>
  )
}
