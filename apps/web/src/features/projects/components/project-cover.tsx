import { ResponsiveImage } from '@/components/content/responsive-image'
import { initials } from '@/lib/initials'
import type { Media } from '@/lib/strapi/schemas'
import { cn } from '@/lib/utils'

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
