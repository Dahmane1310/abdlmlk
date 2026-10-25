import { cn } from '@/lib/utils'

/** Centers content with the site's page width and side padding. */
export function Container({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-5xl px-4 sm:px-6', className)}
      {...props}
    />
  )
}
