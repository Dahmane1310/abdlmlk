import { cn } from '@/lib/utils'

/** Technology names as small bordered chips. Renders nothing for an empty list. */
export function TechList({
  technologies,
  className,
}: {
  technologies: { name: string; slug: string }[]
  className?: string
}) {
  if (technologies.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {technologies.map((technology) => (
        <li
          key={technology.slug}
          className="rounded-sm border px-2 py-0.5 font-mono text-xs text-muted-foreground"
        >
          {technology.name}
        </li>
      ))}
    </ul>
  )
}
