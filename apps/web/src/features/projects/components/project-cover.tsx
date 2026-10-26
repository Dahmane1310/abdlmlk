import { ResponsiveImage } from '@/components/content/responsive-image'
import { initials } from '@/lib/initials'
import { cn } from '@/lib/utils'

import type { ProjectSummary } from '../projects.functions'

interface ProjectCoverProps {
  project: Pick<ProjectSummary, 'title' | 'slug' | 'liveUrl' | 'cover'>
  /** How wide the cover is shown, for picking an image size. */
  sizes: string
  className?: string
}

/**
 * The project's picture in an "app window" frame (DESIGN.md): a bar with the
 * site's address (or the slug), then the screenshot, or until one is uploaded
 * the project's initials in blue on the blueprint grid.
 */
export function ProjectCover({ project, sizes, className }: ProjectCoverProps) {
  const address = project.liveUrl ? new URL(project.liveUrl).host : project.slug

  return (
    <div
      className={cn(
        'flex aspect-16/10 flex-col overflow-hidden bg-muted',
        className,
      )}
    >
      {/* Decorative: the card's title says which project this is. */}
      <div
        aria-hidden
        className="flex h-8 shrink-0 items-center gap-1.5 border-b bg-card px-3"
      >
        <span className="size-[7px] rounded-[2px] bg-border" />
        <span className="size-[7px] rounded-[2px] bg-border" />
        <span className="size-[7px] rounded-[2px] bg-border" />
        <span
          dir="ltr"
          className="ms-2 truncate font-mono text-[0.6875rem] text-muted-foreground"
        >
          {address}
        </span>
      </div>
      {project.cover ? (
        <ResponsiveImage
          image={project.cover}
          sizes={sizes}
          className="min-h-0 w-full flex-1 object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex flex-1 items-center justify-center blueprint font-mono text-5xl font-medium tracking-tighter text-primary"
        >
          {initials(project.title)}
        </div>
      )}
    </div>
  )
}
