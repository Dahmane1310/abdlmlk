import { useLocation } from '@tanstack/react-router'
import { ArrowUpRightIcon, CheckIcon, LinkIcon, Share2Icon } from 'lucide-react'
import { useSyncExternalStore } from 'react'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/use-translation'
import { useCopy } from '@/lib/use-copy'

// Like the code blocks' Copy button: small mono text, grey until hovered.
const ITEM_CLASS =
  'inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 font-mono text-xs text-muted-foreground hover:bg-accent hover:text-foreground'

// The page's origin never changes while it's open, so there's nothing to
// subscribe to; on the server it's unknown and links start relative.
const subscribeNever = () => () => undefined

/**
 * Share links for an article (DESIGN.md, "Article page"), at the end of the
 * bar after the text. With a touch screen: one "Share" button for the
 * system's share sheet. With a mouse or keyboard: LinkedIn, X and "Copy
 * link". The pointer media query picks one, so nothing changes after load.
 */
export function ShareLinks({ title }: { title: string }) {
  const t = useTranslation()
  const pathname = useLocation({ select: (location) => location.pathname })
  const origin = useSyncExternalStore(
    subscribeNever,
    () => window.location.origin,
    () => '',
  )
  const url = origin + pathname
  const { copied, copy } = useCopy()

  const networks = [
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url }).toString()}`,
    },
    {
      name: 'X',
      href: `https://x.com/intent/tweet?${new URLSearchParams({ text: title, url }).toString()}`,
    },
  ]

  const share = () => {
    // Browsers without a share sheet get the link copied instead.
    if ('share' in navigator) {
      // Rejected when the reader closes the sheet: nothing to do.
      navigator.share({ title, url }).catch(() => undefined)
    } else {
      copy(url)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={share}
        className="hidden pointer-coarse:inline-flex"
      >
        {copied ? <CheckIcon aria-hidden /> : <Share2Icon aria-hidden />}
        <span aria-live="polite">
          {copied ? t.content.copied : t.blog.share}
        </span>
      </Button>
      <div
        role="group"
        aria-labelledby="share-label"
        className="flex flex-wrap items-center gap-1 pointer-coarse:hidden"
      >
        <span id="share-label" className="me-1 mono-label">
          {t.blog.share}
        </span>
        {networks.map(({ name, href }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={ITEM_CLASS}
          >
            {name}
            <ArrowUpRightIcon
              aria-hidden
              className="size-3.5 rtl:-scale-x-100"
            />
            <span className="sr-only"> ({t.blog.newTab})</span>
          </a>
        ))}
        <button
          type="button"
          onClick={() => {
            copy(url)
          }}
          className={ITEM_CLASS}
        >
          {copied ? (
            <CheckIcon aria-hidden className="size-3.5 text-primary" />
          ) : (
            <LinkIcon aria-hidden className="size-3.5" />
          )}
          <span aria-live="polite">
            {copied ? t.content.copied : t.blog.copyLink}
          </span>
        </button>
      </div>
    </>
  )
}
