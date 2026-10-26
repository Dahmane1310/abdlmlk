import { cn } from '@/lib/utils'

import { STRIP_CELL_CLASS, STRIP_CLASS } from './strip'

interface Fact {
  label: string
  value: React.ReactNode
}

/** Key facts as a strip (DESIGN.md): a mono label above each value. */
export function FactsStrip({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null

  return (
    <dl className={STRIP_CLASS}>
      {facts.map((fact) => (
        <div
          key={fact.label}
          className={cn(STRIP_CELL_CLASS, 'flex flex-col gap-2')}
        >
          <dt className="mono-label">{fact.label}</dt>
          <dd className="text-[1.0625rem]">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
