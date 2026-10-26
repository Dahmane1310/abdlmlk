import { cn } from '@/lib/utils'

interface Technology {
  name: string
  slug: string
  /** Simple Icons path data (24×24), added on the server; null shows the name only. */
  iconPath: string | null
}

// "sm" for cards and job rows; "lg" for the About page's skills rows.
const SIZES = {
  sm: {
    list: 'gap-x-4 gap-y-1.5',
    item: 'gap-1.5 font-mono text-xs text-muted-foreground',
    logo: 'size-3.5',
  },
  lg: {
    list: 'gap-x-7 gap-y-3',
    item: 'gap-2 text-[0.9375rem]',
    logo: 'size-4.25',
  },
}

/**
 * Technologies as logo and name, without borders (DESIGN.md: only clickable
 * things get a border). Renders nothing for an empty list.
 */
export function TechList({
  technologies,
  size = 'sm',
  className,
}: {
  technologies: Technology[]
  size?: keyof typeof SIZES
  className?: string
}) {
  if (technologies.length === 0) return null

  const styles = SIZES[size]

  return (
    <ul className={cn('flex flex-wrap', styles.list, className)}>
      {technologies.map((technology) => (
        <li
          key={technology.slug}
          className={cn('inline-flex items-center', styles.item)}
        >
          {/* In the text colour, so logos fit the one-accent design and both
              themes. Decorative: the name is right next to it. */}
          {technology.iconPath && (
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className={cn('shrink-0 fill-current', styles.logo)}
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
