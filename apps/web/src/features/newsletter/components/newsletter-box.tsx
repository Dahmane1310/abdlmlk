import { RssIcon } from 'lucide-react'
import { useId } from 'react'

import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { NewsletterForm } from './newsletter-form'

/**
 * "Get new articles by email" (DESIGN.md, "Newsletter box"): a bordered card
 * like the series card, after an article's series card and at the end of the
 * blog list.
 */
export function NewsletterBox() {
  const t = useTranslation()
  const lang = useLanguage()
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
      {/* The other way to follow new articles. A plain link: the feed is a
          file the server answers, not a page of the app. */}
      <p className="text-sm text-muted-foreground">
        {t.newsletter.rssPrompt}{' '}
        <a
          href={`/${lang}/rss.xml`}
          className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
        >
          <RssIcon aria-hidden className="size-3.5" />
          {t.newsletter.rss}
        </a>
      </p>
    </section>
  )
}
