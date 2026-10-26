import { SpecList, SpecRow } from '@/components/content/spec-list'
import { formatDateRange } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { Career } from '../career.functions'
import { OrganizationLine } from './organization-line'

/**
 * Degrees as spec rows (DESIGN.md, "Education"): the period in the label
 * column, then the degree and field, the school and place, and a short
 * description.
 */
export function EducationList({ degrees }: { degrees: Career['education'] }) {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <SpecList spacing="roomy">
      {degrees.map((degree) => (
        <SpecRow
          key={degree.documentId}
          label={
            <p className="font-mono text-[0.8125rem] text-muted-foreground">
              {formatDateRange(
                degree.startDate,
                degree.endDate,
                lang,
                t.dates.present,
              )}
            </p>
          }
        >
          <h3 className="text-xl leading-snug font-semibold">
            {[degree.degree, degree.field]
              .filter((part) => part != null)
              .join(t.career.fieldSeparator)}
          </h3>
          <OrganizationLine
            organization={degree.organization}
            details={[degree.location]}
            className="mt-1"
          />
          {/* Rendered and sanitized on the server (lib/markdown). */}
          {degree.descriptionHtml && (
            <div
              className="prose mt-3 max-w-none [--tw-prose-body:var(--muted-foreground)] [&>p]:text-[0.9375rem]"
              dangerouslySetInnerHTML={{ __html: degree.descriptionHtml }}
            />
          )}
        </SpecRow>
      ))}
    </SpecList>
  )
}
