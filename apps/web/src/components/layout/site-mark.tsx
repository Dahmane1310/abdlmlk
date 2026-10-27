import { initials } from '@/lib/initials'
import { cn } from '@/lib/utils'

/**
 * The blue square with the site name's initials (DESIGN.md, "Site header"),
 * in the navbar and an article's byline. Decorative: the name is always
 * written next to it.
 */
export function SiteMark({
  name,
  className,
}: {
  name: string
  /** Size and text size; the navbar's is 28px. */
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-[5px] bg-primary font-mono text-[0.6875rem] font-semibold text-primary-foreground',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
