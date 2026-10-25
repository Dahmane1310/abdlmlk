import { ResponsiveImage } from '@/components/content/responsive-image'
import type { Media } from '@/lib/strapi/schemas'
import { cn } from '@/lib/utils'

// Zero-width non-joiner: keeps Arabic initials as separate letters instead of
// joining them into what reads like a word. Invisible, no effect on Latin text.
const NON_JOINER = '\u200C'

/** First letters of the first two words: "Pharmacy Management System" gives "PM". */
function initials(title: string) {
  return title
    .split(/\s+/)
    .filter((word) => /^\p{L}/u.test(word))
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join(NON_JOINER)
}

interface ProjectCoverProps {
  title: string
  cover: Media | null
  /** How wide the cover is shown, for picking an image size. */
  sizes: string
  className?: string
}

/** The project's cover image, or a placeholder with its initials until one is uploaded. */
export function ProjectCover({
  title,
  cover,
  sizes,
  className,
}: ProjectCoverProps) {
  return (
    <div className={cn('aspect-16/10 overflow-hidden bg-muted', className)}>
      {cover ? (
        <ResponsiveImage
          image={cover}
          sizes={sizes}
          className="size-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex size-full items-center justify-center font-mono text-5xl font-medium tracking-tight text-muted-foreground/40"
        >
          {initials(title)}
        </div>
      )}
    </div>
  )
}
