/**
 * Headline numbers in a bordered grid. The 1px gaps over a border-coloured
 * background draw the lines, the same in both text directions. Columns fit
 * the available width, so one metric or four fill the row without gaps.
 */
export function MetricGrid({
  items,
}: {
  items: { value: string; label: string }[]
}) {
  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-px overflow-hidden rounded-xl border bg-border">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col-reverse gap-2 bg-background p-6"
        >
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="font-mono text-3xl font-medium tracking-tight">
            {/* Numbers read left to right, even on Arabic pages ("15–25%", not "25%–15"). */}
            <span dir="ltr">{item.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
