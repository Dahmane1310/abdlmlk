import { cn } from '@/lib/utils'

import type { Career } from '../career.functions'

/**
 * The line under a job or degree title: the organization (a link when it has
 * a website), then the work mode, place and so on in grey.
 */
export function OrganizationLine({
  organization,
  details,
  className,
}: {
  organization: Career['experience'][number]['organization']
  details: (string | null)[]
  className?: string
}) {
  const shown = details.filter((detail) => detail != null)

  if (!organization && shown.length === 0) return null

  return (
    // Separate items, so Latin and Arabic never reorder across the dots.
    // Each dot trails its item, so a wrapped line never starts with one.
    <p
      className={cn(
        'flex flex-wrap gap-x-2 text-[0.9375rem] text-muted-foreground',
        className,
      )}
    >
      {organization && (
        <span className="flex gap-x-2">
          {organization.website ? (
            <a
              href={organization.website}
              className="text-primary underline-offset-4 hover:underline"
            >
              {organization.name}
            </a>
          ) : (
            <span className="text-foreground">{organization.name}</span>
          )}
          {shown.length > 0 && <span aria-hidden>·</span>}
        </span>
      )}
      {shown.map((detail, index) => (
        <span key={detail} className="flex gap-x-2">
          {detail}
          {index < shown.length - 1 && <span aria-hidden>·</span>}
        </span>
      ))}
    </p>
  )
}
