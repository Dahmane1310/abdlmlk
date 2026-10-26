import {
  CircleAlertIcon,
  InfoIcon,
  LightbulbIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { ContentBlock } from '@/lib/content/blocks.server'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import { ResponsiveImage } from './responsive-image'

type CalloutVariant = Extract<ContentBlock, { type: 'callout' }>['variant']

const CALLOUT_STYLES: Record<
  CalloutVariant,
  { icon: LucideIcon; className: string }
> = {
  note: { icon: InfoIcon, className: 'border-border bg-muted/50' },
  tip: { icon: LightbulbIcon, className: 'border-primary/40 bg-primary/5' },
  warning: {
    icon: TriangleAlertIcon,
    className: 'border-warning/60 bg-warning/10',
  },
  danger: {
    icon: CircleAlertIcon,
    className: 'border-destructive/60 bg-destructive/10',
  },
}

// Layout width of the reading column, for picking image sizes.
const CONTENT_SIZES = '(min-width: 768px) 48rem, 100vw'

/**
 * CMS content blocks. Markdown and code arrive as HTML already sanitized and
 * highlighted on the server (lib/content/blocks.server.ts), so rendering it
 * with dangerouslySetInnerHTML is safe here.
 */
export function ContentBlocks({
  blocks,
  className,
}: {
  blocks: ContentBlock[]
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {blocks.map((block) => (
        <Block key={block.key} block={block} />
      ))}
    </div>
  )
}

function Block({ block }: { block: ContentBlock }) {
  const t = useTranslation()

  switch (block.type) {
    case 'rich-text':
      return (
        <div
          className="square-bullets prose max-w-none"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      )
    case 'quote':
      return (
        <figure className="border-s-2 border-primary ps-6">
          <blockquote className="text-xl leading-relaxed">
            {block.text}
          </blockquote>
          {block.cite && (
            <figcaption className="mt-3 font-mono text-xs text-muted-foreground">
              {block.cite}
            </figcaption>
          )}
        </figure>
      )
    case 'media':
      return (
        <ResponsiveImage
          image={block.image}
          sizes={CONTENT_SIZES}
          className="w-full rounded-xl border"
        />
      )
    case 'gallery':
      return (
        <ul className="grid gap-4 sm:grid-cols-2">
          {block.images.map((image) => (
            <li key={image.url}>
              <ResponsiveImage
                image={image}
                sizes="(min-width: 768px) 24rem, 100vw"
                className="aspect-16/10 w-full rounded-xl border object-cover"
              />
            </li>
          ))}
        </ul>
      )
    case 'code':
      return (
        // Code reads left to right, even on Arabic pages.
        <figure dir="ltr" className="overflow-hidden rounded-xl border">
          {block.filename && (
            <figcaption className="border-b bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
              {block.filename}
            </figcaption>
          )}
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
        </figure>
      )
    case 'callout': {
      const { icon: Icon, className } = CALLOUT_STYLES[block.variant]
      return (
        <aside className={cn('flex gap-3 rounded-xl border p-4', className)}>
          <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="font-medium">
              {block.title ?? t.content.callout[block.variant]}
            </p>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          </div>
        </aside>
      )
    }
  }
}
