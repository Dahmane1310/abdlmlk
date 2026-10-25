import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import type { Availability } from '../profile.schema'

interface AvailabilityBadgeProps {
  availability: Availability
  /** The CMS note, e.g. "Open to remote roles and freelance projects." */
  note: string | null
}

/** Status pill: the dot shows whether you're available, the text says for what. */
export function AvailabilityBadge({
  availability,
  note,
}: AvailabilityBadgeProps) {
  const t = useTranslation()
  const available = availability !== 'not_available'

  return (
    <p className="inline-flex items-center gap-2 rounded-md border px-3 py-1 font-mono text-xs text-muted-foreground">
      <span
        aria-hidden
        className={cn(
          'size-2 rounded-full',
          available ? 'bg-primary' : 'bg-muted-foreground',
        )}
      />
      {note ?? t.availability[availability]}
    </p>
  )
}
