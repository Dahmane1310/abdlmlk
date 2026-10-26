import { MetricGrid } from '@/components/content/metric-grid'
import type { Profile } from '@/features/profile/profile.schema'
import { useTranslation } from '@/lib/i18n/use-translation'

/** The headline numbers, shown in the home header's transition band. */
export function Highlights({ items }: { items: Profile['highlights'] }) {
  const t = useTranslation()

  return (
    <section aria-labelledby="highlights-title">
      {/* Part of the intro visually, so the title is for screen readers only. */}
      <h2 id="highlights-title" className="sr-only">
        {t.home.highlights}
      </h2>
      <MetricGrid items={items} />
    </section>
  )
}
