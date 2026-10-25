import { cn } from '@/lib/utils'

/**
 * Short facts on one small mono line: "Product · Apr 2023 — Aug 2024".
 * Empty items are skipped.
 */
export function MetaLine({
  items,
  className,
}: {
  items: (string | null | undefined)[]
  className?: string
}) {
  const shown = items.filter((item) => item != null && item !== '')

  if (shown.length === 0) return null

  return (
    // Separate items, so mixed Arabic and Latin text never reorders across them.
    // Each separator trails its item, so a wrapped line never starts with one.
    <p
      className={cn(
        'flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground',
        className,
      )}
    >
      {shown.map((item, index) => (
        <span key={item} className="flex gap-x-2">
          {item}
          {index < shown.length - 1 && <span aria-hidden>·</span>}
        </span>
      ))}
    </p>
  )
}
