import { MetricGrid } from '@/components/content/metric-grid'
import { Container } from '@/components/layout/container'
import type { Profile } from '@/features/profile/profile.schema'
import { useTranslation } from '@/lib/i18n/use-translation'

export function Highlights({ items }: { items: Profile['highlights'] }) {
  const t = useTranslation()

  if (items.length === 0) return null

  return (
    <Container className="pb-20 md:pb-28">
      <section aria-labelledby="highlights-title">
        <h2 id="highlights-title" className="sr-only">
          {t.home.highlights}
        </h2>
        <MetricGrid items={items} />
      </section>
    </Container>
  )
}
