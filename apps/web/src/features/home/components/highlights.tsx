import { Container } from '@/components/layout/container'
import type { Profile } from '@/features/profile/profile.schema'
import { useTranslation } from '@/lib/i18n/use-translation'

/** Headline numbers in a bordered grid. The 1px gaps over a border-coloured
 * background draw the lines, so they work the same in both text directions. */
export function Highlights({ items }: { items: Profile['highlights'] }) {
  const t = useTranslation()

  if (items.length === 0) return null

  return (
    <Container className="pb-20 md:pb-28">
      <section aria-labelledby="highlights-title">
        <h2 id="highlights-title" className="sr-only">
          {t.home.highlights}
        </h2>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
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
      </section>
    </Container>
  )
}
