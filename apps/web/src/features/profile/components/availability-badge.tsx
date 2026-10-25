import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import type { Availability } from '../profile.schema'

interface AvailabilityBadgeProps {
  availability: Availability
  /** The CMS note, e.g. "Open to remote roles and freelance projects." Not shown when compact. */
  note?: string | null
  /**
   * Just the dot and a few words ("Open to work"), in the surrounding text
   * style, for places like the About page facts strip.
   */
  compact?: boolean
}

/** Availability: the dot shows whether you're available, the text says for what. */
export function AvailabilityBadge({
  availability,
  note,
  compact = false,
}: AvailabilityBadgeProps) {
  const t = useTranslation()
  const available = availability !== 'not_available'

  return (
    <p
      className={cn(
        'inline-flex items-center gap-2',
        !compact &&
          'rounded-md border px-3 py-1 font-mono text-xs text-muted-foreground',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'size-2 shrink-0 rounded-full',
          available ? 'bg-primary' : 'bg-muted-foreground',
        )}
      />
      {compact
        ? t.availabilityShort[availability]
        : (note ?? t.availability[availability])}
    </p>
  )
}
