import { useId } from 'react'

import { useTranslation } from '@/lib/i18n/use-translation'

import { NewsletterForm } from './newsletter-form'

/**
 * "Get new articles by email" (DESIGN.md, "Newsletter box"): a bordered card
 * like the series card, after an article's series card and at the end of the
 * blog list.
 */
export function NewsletterBox() {
  const t = useTranslation()
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="flex max-w-3xl flex-col gap-5 rounded-xl border p-6"
    >
      <div className="flex flex-col gap-1">
        <p className="mono-label">{t.newsletter.label}</p>
        <h2 id={titleId} className="text-lg font-semibold tracking-tight">
          {t.newsletter.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t.newsletter.description}
        </p>
      </div>
      <NewsletterForm />
    </section>
  )
}
