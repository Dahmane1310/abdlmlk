import { FactsStrip } from '@/components/content/facts-strip'
import type { Career } from '@/features/career/career.functions'
import { AvailabilityStatus } from '@/features/profile/components/availability-status'
import type { Profile } from '@/features/profile/profile.schema'
import { useTranslation } from '@/lib/i18n/use-translation'

interface ProfileFactsProps {
  profile: Profile
  experience: Career['experience']
}

/** The About page's facts: current job, location, start year and availability. */
export function ProfileFacts({ profile, experience }: ProfileFactsProps) {
  const t = useTranslation()

  const currentJob = experience.find((job) => job.endDate === null)
  // ISO dates sort as text, so the first is the earliest.
  const firstStart = experience
    .map((job) => job.startDate)
    .sort()
    .at(0)

  const facts = [
    currentJob
      ? {
          label: t.about.currently,
          value: (
            <>
              {currentJob.role}
              {currentJob.organization && (
                <span className="block text-muted-foreground">
                  {currentJob.organization.name}
                </span>
              )}
            </>
          ),
        }
      : null,
    profile.location
      ? { label: t.about.basedIn, value: profile.location }
      : null,
    firstStart
      ? { label: t.about.workingSince, value: firstStart.slice(0, 4) }
      : null,
    {
      label: t.about.status,
      value: (
        <>
          <AvailabilityStatus availability={profile.availability} />
          {/* The CMS note says for what: "Remote roles and freelance projects." */}
          {profile.availabilityNote && (
            <span className="block text-muted-foreground">
              {profile.availabilityNote}
            </span>
          )}
        </>
      ),
    },
  ].filter((fact) => fact != null)

  return <FactsStrip facts={facts} />
}
