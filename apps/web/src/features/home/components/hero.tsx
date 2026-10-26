import { ArrowRightIcon } from 'lucide-react'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { AvailabilityStatus } from '@/features/profile/components/availability-status'
import { ProfileActions } from '@/features/profile/components/profile-actions'
import type { Profile } from '@/features/profile/profile.schema'
import { useTranslation } from '@/lib/i18n/use-translation'

import { Highlights } from './highlights'
import { SELECTED_WORK_ID } from './selected-work'

export function Hero({
  profile,
  showWorkLink,
}: {
  profile: Profile
  /** Only when the page has a "Selected work" section to jump to. */
  showWorkLink: boolean
}) {
  const t = useTranslation()

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
      <ProfileActions profile={profile}>
        {showWorkLink && (
          <Button asChild size="lg" variant="ghost">
            <a href={`#${SELECTED_WORK_ID}`}>
              {t.home.seeMyWork}
              <ArrowRightIcon aria-hidden className="rtl:rotate-180" />
            </a>
          </Button>
        )}
      </ProfileActions>
    </PageHeader>
  )
}
