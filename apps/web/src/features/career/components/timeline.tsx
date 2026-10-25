import { MetaLine } from '@/components/content/meta-line'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import type { Organization } from '../career.schema'
import { OrganizationMark } from './organization-mark'
import { OrganizationName } from './organization-name'

/** A vertical timeline, newest first. */
export function Timeline({ children }: { children: React.ReactNode }) {
  return <ol>{children}</ol>
}

interface TimelineItemProps {
  /** "Jun 2024 — Present" */
  period: string | null
  /** "2 years 5 months" */
  duration: string | null
  /** Still ongoing: the marker fills with the accent colour and a badge says so. */
  current: boolean
  title: string
  organization: Organization | null
  /** Short facts under the name: work mode, location… */
  meta: (string | null | undefined)[]
  /** Summary, rich text, technologies. */
  children?: React.ReactNode
}

/**
 * One entry: a marker on a line running along the start edge (the right in
 * Arabic), the dates, then the details beside the organization's logo.
 */
export function TimelineItem({
  period,
  duration,
  current,
  title,
  organization,
  meta,
  children,
}: TimelineItemProps) {
  const t = useTranslation()

  return (
    <li className="relative ps-9 pb-12 before:absolute before:inset-s-[7px] before:top-2 before:-bottom-2 before:w-px before:bg-border last:pb-0 last:before:hidden">
      <span
        aria-hidden
        className={cn(
          'absolute inset-s-0 top-0.5 size-[15px] rounded-full border-2',
          current ? 'border-primary bg-primary' : 'border-input bg-background',
        )}
      />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <MetaLine items={[period, duration]} />
        {current && (
          <span className="rounded-sm border border-primary/40 bg-primary/10 px-1.5 font-mono text-xs text-primary">
            {t.career.current}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-4">
        {/* Hidden on phones, where the width is better spent on the text. */}
        {organization && (
          <OrganizationMark
            organization={organization}
            className="hidden sm:flex"
          />
        )}
        <div className="flex max-w-3xl min-w-0 flex-1 flex-col gap-3">
          <div>
            <h3 className="text-lg leading-snug font-semibold">{title}</h3>
            {organization && <OrganizationName organization={organization} />}
          </div>
          <MetaLine items={meta} />
          {children}
        </div>
      </div>
    </li>
  )
}
