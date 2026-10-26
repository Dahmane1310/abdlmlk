import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import type { ProjectSummary } from '../projects.functions'

function ProjectNavLink({
  project,
  direction,
}: {
  project: ProjectSummary
  direction: 'previous' | 'next'
}) {
  const t = useTranslation()
  const lang = useLanguage()
  const Arrow = direction === 'previous' ? ArrowLeftIcon : ArrowRightIcon

  return (
    <Link
      to="/$lang/projects/$slug"
      params={{ lang, slug: project.slug }}
      className={cn(
        'flex flex-col gap-1 rounded-xl border p-5 transition-colors hover:border-input',
        direction === 'next' && 'sm:col-start-2 sm:items-end sm:text-end',
      )}
    >
      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        {direction === 'previous' && (
          <Arrow aria-hidden className="size-3.5 rtl:rotate-180" />
        )}
        {direction === 'previous' ? t.projects.previous : t.projects.next}
        {direction === 'next' && (
          <Arrow aria-hidden className="size-3.5 rtl:rotate-180" />
        )}
      </span>
      <span className="font-medium">{project.title}</span>
    </Link>
  )
}

/** Links to the projects before and after this one, in the same order as the list. */
export function ProjectNav({
  previous,
  next,
}: {
  previous: ProjectSummary | undefined
  next: ProjectSummary | undefined
}) {
  const t = useTranslation()

  if (!previous && !next) return null

  return (
    // No line of its own: the page draws one between sections (Page).
    <nav
      aria-label={t.projects.moreProjects}
      className="grid gap-4 sm:grid-cols-2"
    >
      {previous && <ProjectNavLink project={previous} direction="previous" />}
      {next && <ProjectNavLink project={next} direction="next" />}
    </nav>
  )
}
