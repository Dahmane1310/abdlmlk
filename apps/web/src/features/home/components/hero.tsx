import { MapPinIcon } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { AvailabilityBadge } from '@/features/profile/components/availability-badge'
import { ProfileActions } from '@/features/profile/components/profile-actions'
import type { Profile } from '@/features/profile/profile.schema'

export function Hero({ profile }: { profile: Profile }) {
  return (
    <Container className="py-20 md:py-28">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <AvailabilityBadge
          availability={profile.availability}
          note={profile.availabilityNote}
        />
        {profile.location && (
          <p className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <MapPinIcon aria-hidden className="size-3.5" />
            {profile.location}
          </p>
        )}
      </div>

      <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
        {profile.fullName}
      </h1>
      <p className="mt-3 font-mono text-lg text-primary sm:text-xl">
        {profile.headline}
      </p>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        {profile.intro}
      </p>

      <ProfileActions profile={profile} className="mt-10" />
    </Container>
  )
}
