import { createLink } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function ArrowLinkAnchor({
  className,
  children,
  ...props
}: React.ComponentProps<'a'>) {
  return (
    <a
      {...props}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline',
        className,
      )}
    >
      {children}
      <ArrowRightIcon aria-hidden className="size-4 rtl:rotate-180" />
    </a>
  )
}

/**
 * A text link with an arrow that points the reading way: "All projects →",
 * "Full story →" (DESIGN.md, "Buttons"). Takes the same props as Link.
 */
export const ArrowLink = createLink(ArrowLinkAnchor)
