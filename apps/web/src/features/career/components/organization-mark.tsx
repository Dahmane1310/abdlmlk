import { ResponsiveImage } from '@/components/content/responsive-image'
import { initials } from '@/lib/initials'
import { cn } from '@/lib/utils'

import type { Organization } from '../career.schema'

/**
 * The organization's logo, or its initials until one is uploaded. Hidden from
 * screen readers: the name is always written next to it.
 */
export function OrganizationMark({
  organization,
  className,
}: {
  organization: Organization
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border font-mono text-xs font-medium text-muted-foreground',
        organization.logo ? 'bg-background' : 'bg-muted',
        className,
      )}
    >
      {organization.logo ? (
        <ResponsiveImage
          image={organization.logo}
          sizes="2.5rem"
          className="size-full object-contain p-1"
        />
      ) : (
        initials(organization.name)
      )}
    </div>
  )
}
