import { PageHeader } from '@/components/layout/page-header'
import { DownloadCvButton } from '@/features/profile/components/download-cv-button'
import type { Profile } from '@/features/profile/profile.schema'
import { useTranslation } from '@/lib/i18n/use-translation'

/**
 * A plain page header like the Projects page's, not a second introduction:
 * Home already says who I am, so About is the online CV (DESIGN.md).
 */
export function AboutHeader({ resume }: { resume: Profile['resume'] }) {
  const t = useTranslation()

  return (
    <PageHeader
      eyebrow={t.about.title}
      title={t.about.heading}
      lead={t.about.lead}
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
