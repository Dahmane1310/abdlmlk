import { cn } from '@/lib/utils'

import { Container } from './container'

/**
 * Every page's frame: the site width, the same space above and below, and the
 * same gap between the header and each section.
 */
export function Page({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <Container
      className={cn('flex flex-col gap-16 py-12 md:gap-20 md:py-16', className)}
      {...props}
    />
  )
}
