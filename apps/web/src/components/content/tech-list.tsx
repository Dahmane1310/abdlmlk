import { cn } from '@/lib/utils'

interface Technology {
  name: string
  slug: string
  /** Simple Icons path data (24×24), added on the server; null shows the name only. */
  iconPath: string | null
}

/** Technologies as small bordered chips, logo then name. Renders nothing for an empty list. */
export function TechList({
  technologies,
  className,
}: {
  technologies: Technology[]
  className?: string
}) {
  if (technologies.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {technologies.map((technology) => (
        <li
          key={technology.slug}
          className="inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-xs text-muted-foreground"
        >
          {/* In the text colour, so logos fit the one-accent design and both
              themes. Decorative: the name is right next to it. */}
          {technology.iconPath && (
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-3.5 shrink-0 fill-current"
            >
              <path d={technology.iconPath} />
            </svg>
          )}
          {technology.name}
        </li>
      ))}
    </ul>
  )
}
