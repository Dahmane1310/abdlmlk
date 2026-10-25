import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import type { Availability } from '../profile.schema'

/**
 * "● Open to work": the dot shows whether you're available, the words say
 * for what. Takes the surrounding text style, so it fits a label or a value.
 */
export function AvailabilityStatus({
  availability,
}: {
  availability: Availability
}) {
  const t = useTranslation()

  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className={cn(
          'size-2 shrink-0 rounded-full',
          availability === 'not_available'
            ? 'bg-muted-foreground'
            : 'bg-primary',
        )}
      />
      {t.availability[availability]}
    </span>
  )
}
