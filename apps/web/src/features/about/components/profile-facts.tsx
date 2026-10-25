import type { Career } from '@/features/career/career.functions'
import { AvailabilityBadge } from '@/features/profile/components/availability-badge'
import type { Profile } from '@/features/profile/profile.schema'
import { useTranslation } from '@/lib/i18n/use-translation'

interface ProfileFactsProps {
  profile: Profile
  experience: Career['experience']
}

/**
 * Key facts in one bordered strip under the name: current job, location,
 * start year and availability. Cells grow to fill each row, so a missing fact
 * never leaves an empty cell; on phones they wrap two per row.
 */
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
      value: <AvailabilityBadge availability={profile.availability} compact />,
    },
  ].filter((fact) => fact != null)

  return (
    // The 1px gaps over a border-coloured background draw the lines, like MetricGrid.
    <dl className="flex flex-wrap gap-px overflow-hidden rounded-xl border bg-border">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="flex flex-1 basis-40 flex-col gap-1.5 bg-background p-5"
        >
          <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            {fact.label}
          </dt>
          <dd className="text-sm">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
