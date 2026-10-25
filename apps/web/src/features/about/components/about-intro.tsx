import { ResponsiveImage } from '@/components/content/responsive-image'
import { PageHeader } from '@/components/layout/page-header'
import type { Career } from '@/features/career/career.functions'
import { ProfileActions } from '@/features/profile/components/profile-actions'
import type { ProfileDetails } from '@/features/profile/profile.functions'
import type { Profile } from '@/features/profile/profile.schema'
import { useTranslation } from '@/lib/i18n/use-translation'

import { ProfileFacts } from './profile-facts'

interface AboutIntroProps {
  profile: Profile
  details: ProfileDetails
  experience: Career['experience']
}

/** Name and photo, the facts strip, then the bio and contact buttons. */
export function AboutIntro({ profile, details, experience }: AboutIntroProps) {
  const t = useTranslation()

  return (
    <PageHeader
      eyebrow={t.about.title}
      title={profile.fullName}
      subtitle={profile.headline}
      media={
        // No placeholder without a photo: the name is right beside it.
        details.avatar && (
          <ResponsiveImage
            image={details.avatar}
            sizes="(min-width: 768px) 8rem, 6rem"
            priority
            className="size-24 shrink-0 rounded-xl border object-cover md:size-32"
          />
        )
      }
    >
      <ProfileFacts profile={profile} experience={experience} />
      <div className="flex flex-col gap-8">
        {/* Rendered and sanitized on the server (lib/markdown). The first
            paragraph is a larger lead, to give the eye a place to start. */}
        {details.bioHtml && (
          <div
            className="prose max-w-3xl [&>p:first-child]:text-lg [&>p:first-child]:text-foreground md:[&>p:first-child]:text-xl"
            dangerouslySetInnerHTML={{ __html: details.bioHtml }}
          />
        )}
        <ProfileActions profile={profile} />
      </div>
    </PageHeader>
  )
}
