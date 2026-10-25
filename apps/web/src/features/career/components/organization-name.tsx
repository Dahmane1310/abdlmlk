import { ArrowUpRightIcon } from 'lucide-react'

import type { Organization } from '../career.schema'

/** The organization's name, linked to its website when it has one. */
export function OrganizationName({
  organization,
}: {
  organization: Organization
}) {
  if (!organization.website) {
    return <p className="text-muted-foreground">{organization.name}</p>
  }

  return (
    <p>
      <a
        href={organization.website}
        className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
      >
        {organization.name}
        <ArrowUpRightIcon aria-hidden className="size-4 rtl:-scale-x-100" />
      </a>
    </p>
  )
}
