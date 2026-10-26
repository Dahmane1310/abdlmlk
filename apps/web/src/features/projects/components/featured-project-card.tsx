import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { ProjectSummary } from '../projects.functions'
import { ProjectCover } from './project-cover'
import { ProjectMeta } from './project-meta'

/**
 * The wide card for the first featured project on the home page (DESIGN.md,
 * "Featured card"): the cover on one side, a larger body on the other; the
 * cover goes on top on phones. Clickable everywhere, like ProjectCard.
 */
export function FeaturedProjectCard({ project }: { project: ProjectSummary }) {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <article className="relative grid overflow-hidden rounded-xl border bg-card text-card-foreground transition-colors hover:border-input has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/50 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <ProjectCover
        project={project}
        sizes="(min-width: 1024px) 37rem, (min-width: 768px) 60vw, 100vw"
        initialsSize="lg"
        className="border-b md:border-e md:border-b-0"
      />
      <div className="flex flex-col justify-center gap-3.5 p-6 md:p-9">
        <ProjectMeta project={project} />
        <h3 className="text-[1.875rem] leading-tight font-semibold tracking-tight">
          <Link
            to="/$lang/projects/$slug"
            params={{ lang, slug: project.slug }}
            className="outline-none after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-muted-foreground">{project.summary}</p>
        {/* Not a second link: the title already covers the card and goes to
            the same page, so this only says where a click leads. */}
        <span
          aria-hidden
          className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-primary"
        >
          {t.projects.readCaseStudy}
          <ArrowRightIcon className="size-4 rtl:rotate-180" />
        </span>
      </div>
    </article>
  )
}
