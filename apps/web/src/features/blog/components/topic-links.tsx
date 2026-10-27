import { Link } from '@tanstack/react-router'

import { useLanguage } from '@/lib/i18n/use-language'
import { cn } from '@/lib/utils'

import type { Tag } from '../blog.schema'

/** An article's topics as small links; each filters the blog list (?tag=). */
export function TopicLinks({
  tags,
  className,
}: {
  tags: Tag[]
  className?: string
}) {
  const lang = useLanguage()

  if (tags.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap gap-x-4 gap-y-1', className)}>
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link
            to="/$lang/blog"
            params={{ lang }}
            search={{ tag: tag.slug }}
            className="font-mono text-xs text-muted-foreground hover:text-primary"
          >
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
