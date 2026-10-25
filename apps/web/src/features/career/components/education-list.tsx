import { MetaLine } from '@/components/content/meta-line'
import { formatDateRange } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { Career } from '../career.functions'
import { OrganizationMark } from './organization-mark'
import { OrganizationName } from './organization-name'

/** Degrees as cards, side by side from tablet width. */
export function EducationList({ degrees }: { degrees: Career['education'] }) {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {degrees.map((degree) => (
        <li
          key={degree.documentId}
          className="flex flex-col gap-4 rounded-xl border bg-card p-6"
        >
          <div className="flex items-start justify-between gap-4">
            {degree.organization && (
              <OrganizationMark organization={degree.organization} />
            )}
            <MetaLine
              items={[
                formatDateRange(
                  degree.startDate,
                  degree.endDate,
                  lang,
                  t.dates.present,
                ),
              ]}
            />
          </div>
          <div>
            <h3 className="text-lg leading-snug font-semibold">
              {degree.degree}
            </h3>
            {degree.field && <p>{degree.field}</p>}
          </div>
          <div className="flex flex-col gap-1">
            {degree.organization && (
              <OrganizationName organization={degree.organization} />
            )}
            <MetaLine items={[degree.location]} />
          </div>
          {/* Rendered and sanitized on the server (lib/markdown). */}
          {degree.descriptionHtml && (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: degree.descriptionHtml }}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
