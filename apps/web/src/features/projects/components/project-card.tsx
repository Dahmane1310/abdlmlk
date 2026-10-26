import { Link } from '@tanstack/react-router'
import { ArrowUpRightIcon, CodeIcon } from 'lucide-react'

import { TechList } from '@/components/content/tech-list'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { ProjectSummary } from '../projects.functions'
import { ProjectCover } from './project-cover'
import { ProjectMeta } from './project-meta'

export function ProjectCard({
  project,
  headingLevel = 'h2',
}: {
  project: ProjectSummary
  /** h3 when the cards sit under a section title, as on the home page. */
  headingLevel?: 'h2' | 'h3'
}) {
  const t = useTranslation()
  const lang = useLanguage()
  const Heading = headingLevel

  return (
    // The title link stretches over the whole card (after:absolute), so the
    // card is clickable with one accessible link; other links sit above it.
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground transition-colors hover:border-input has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/50">
      <ProjectCover
        project={project}
        sizes="(min-width: 1024px) 496px, (min-width: 640px) 50vw, 100vw"
        className="border-b"
      />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <ProjectMeta project={project} />
        <Heading className="text-lg font-semibold tracking-tight">
          <Link
            to="/$lang/projects/$slug"
            params={{ lang, slug: project.slug }}
            className="outline-none after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </Heading>
        <p className="text-sm text-muted-foreground">{project.summary}</p>

        <div className="mt-auto flex flex-col gap-4 pt-2">
          <TechList technologies={project.technologies} />
          {(project.liveUrl ?? project.repoUrl) && (
            <div className="relative z-10 flex flex-wrap gap-x-5 gap-y-2 self-start text-sm font-medium">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                >
                  {t.projects.visitSite}
                  <ArrowUpRightIcon
                    aria-hidden
                    className="size-4 rtl:-scale-x-100"
                  />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                >
                  <CodeIcon aria-hidden className="size-4" />
                  {t.projects.sourceCode}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
