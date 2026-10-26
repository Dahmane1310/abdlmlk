import { cn } from '@/lib/utils'

import { STRIP_CELL_CLASS, STRIP_CLASS } from './strip'

/** Headline numbers as a strip (DESIGN.md): a big mono number above a grey caption. */
export function MetricGrid({
  items,
}: {
  items: { value: string; label: string }[]
}) {
  return (
    <dl className={STRIP_CLASS}>
      {items.map((item) => (
        <div
          key={item.label}
          // Reversed for the number-then-caption look; justify-end keeps every
          // number at the top, whatever its caption's length.
          className={cn(
            STRIP_CELL_CLASS,
            'flex flex-col-reverse justify-end gap-2.5',
          )}
        >
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="font-mono text-4xl font-medium tracking-tight">
            {/* Numbers read left to right, even on Arabic pages ("15–25%", not "25%–15"). */}
            <span dir="ltr">{item.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
