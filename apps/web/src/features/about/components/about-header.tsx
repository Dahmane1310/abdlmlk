import { FactsStrip } from '@/components/content/facts-strip'
import { PageHeader } from '@/components/layout/page-header'
import type { Career } from '@/features/career/career.functions'
import { DownloadCvButton } from '@/features/profile/components/download-cv-button'
import type { Profile, SpokenLanguage } from '@/features/profile/profile.schema'
import { useTranslation } from '@/lib/i18n/use-translation'

import { useCvFacts } from './use-cv-facts'

/**
 * A plain page header like the Projects page's, not a second introduction:
 * Home already says who I am, so About is the online CV (DESIGN.md). The
 * transition band below sums the CV up at a glance.
 */
export function AboutHeader({
  resume,
  career,
  languages,
}: {
  resume: Profile['resume']
  career: Career
  languages: SpokenLanguage[]
}) {
  const t = useTranslation()
  const facts = useCvFacts({ career, languages })

  return (
    <PageHeader
      eyebrow={t.about.title}
      title={t.about.heading}
      lead={t.about.lead}
      strip={facts.length > 0 && <FactsStrip facts={facts} />}
    >
      {/* Wrapped: the header stacks its children in a column, which would
          stretch a lone button to the full width. */}
      {resume && (
        <div>
          <DownloadCvButton resume={resume} />
        </div>
      )}
    </PageHeader>
  )
}
