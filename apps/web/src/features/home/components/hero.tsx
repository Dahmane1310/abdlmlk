import { PageHeader } from '@/components/layout/page-header'
import { AvailabilityStatus } from '@/features/profile/components/availability-status'
import { ProfileActions } from '@/features/profile/components/profile-actions'
import type { Profile } from '@/features/profile/profile.schema'

import { Highlights } from './highlights'

export function Hero({ profile }: { profile: Profile }) {
  return (
    <PageHeader
      eyebrow={
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <AvailabilityStatus availability={profile.availability} />
          {profile.location && (
            <>
              <span aria-hidden>·</span>
              <span>{profile.location}</span>
            </>
          )}
        </div>
      }
      title={profile.fullName}
      subtitle={profile.headline}
      lead={profile.intro}
      size="hero"
      strip={
        profile.highlights.length > 0 && (
          <Highlights items={profile.highlights} />
        )
      }
    >
      <ProfileActions profile={profile} />
    </PageHeader>
  )
}
