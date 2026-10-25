import { ResponsiveImage } from '@/components/content/responsive-image'
import type { Media } from '@/lib/strapi/schemas'

// Zero-width non-joiner: keeps Arabic initials as separate letters instead of
// joining them into what reads like a word. Invisible, no effect on Latin text.
const NON_JOINER = '‌'

/** First letters of the first two words: "Pharmacy Management System" gives "PM". */
function initials(title: string) {
  return title
    .split(/\s+/)
    .filter((word) => /^\p{L}/u.test(word))
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join(NON_JOINER)
}

/** The project's cover image, or a placeholder with its initials until one is uploaded. */
export function ProjectCover({
  title,
  cover,
}: {
  title: string
  cover: Media | null
}) {
  return (
    <div className="aspect-16/10 overflow-hidden border-b bg-muted">
      {cover ? (
        <ResponsiveImage
          image={cover}
          sizes="(min-width: 1024px) 496px, (min-width: 640px) 50vw, 100vw"
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
