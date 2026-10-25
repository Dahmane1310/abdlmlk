interface Fact {
  label: string
  value: React.ReactNode
}

/**
 * Key facts in one bordered strip, label above value. The 1px gaps over a
 * border-coloured background draw the lines (like MetricGrid). Cells grow to
 * fill each row, so a missing fact never leaves an empty cell; on phones they
 * wrap two per row.
 */
export function FactsStrip({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null

  return (
    <dl className="flex flex-wrap gap-px overflow-hidden rounded-xl border bg-border">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="flex flex-1 basis-40 flex-col gap-1.5 bg-background p-5"
        >
          <dt className="mono-label">{fact.label}</dt>
          <dd className="text-sm">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
