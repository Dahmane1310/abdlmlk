import { getRouteApi, Link } from '@tanstack/react-router'
import { CircleAlertIcon, CircleCheckIcon, XIcon } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { useTranslation } from '@/lib/i18n/use-translation'

const routeApi = getRouteApi('/$lang/')

/**
 * A slim note above Home's header (DESIGN.md, "Newsletter box") when a reader
 * arrives from a link in one of the newsletter's emails: subscribed,
 * unsubscribed, or the link was no good. Closing it removes ?newsletter=.
 */
export function NewsletterNotice() {
  const t = useTranslation()
  const { newsletter } = routeApi.useSearch()
  if (!newsletter) return null

  const Icon = newsletter === 'invalid' ? CircleAlertIcon : CircleCheckIcon

  return (
    <div role="status" className="border-b bg-muted">
      <Container className="flex items-center gap-3 py-3 text-sm">
        <Icon aria-hidden className="size-4 shrink-0 text-primary" />
        <p className="flex-1">{t.newsletter.notice[newsletter]}</p>
        <Link
          from="/$lang/"
          to="."
          search={{}}
          resetScroll={false}
          aria-label={t.newsletter.notice.close}
          title={t.newsletter.notice.close}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <XIcon aria-hidden className="size-4" />
        </Link>
      </Container>
    </div>
  )
}
