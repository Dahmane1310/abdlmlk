import { cn } from '@/lib/utils'

// Space, not lines, between rows: the label column already marks where each
// row starts. "roomy" for long entries (jobs, degrees), "compact" for
// one-line rows (skills, languages).
const SPACING = {
  roomy: 'gap-12',
  compact: 'gap-5',
}

/**
 * Spec-sheet rows (DESIGN.md, "Spec rows"): a label column (dates, a category,
 * a name) and the content beside it. Every section built from them starts
 * its content at the same edge, so a page of them reads as one document.
 */
export function SpecList({
  spacing = 'compact',
  children,
}: {
  spacing?: keyof typeof SPACING
  children: React.ReactNode
}) {
  return <ul className={cn('flex flex-col', SPACING[spacing])}>{children}</ul>
}

export function SpecRow({
  label,
  children,
}: {
  label: React.ReactNode
  children: React.ReactNode
}) {
  return (
    // Baseline-aligned, so the label sits on the same line as the content's
    // first line, whatever their sizes. On phones the label goes above.
    <li className="grid items-baseline gap-x-8 gap-y-2.5 sm:grid-cols-[11.25rem_minmax(0,1fr)]">
      <div>{label}</div>
      <div className="min-w-0">{children}</div>
    </li>
  )
}
