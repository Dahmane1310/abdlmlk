import { ArrowUpRightIcon, CodeIcon } from 'lucide-react'

import { formatDateRange } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { ProjectSummary } from '../projects.schema'
import { ProjectCover } from './project-cover'

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const t = useTranslation()
  const lang = useLanguage()

  const meta = [
    t.projects.types[project.projectType],
    project.client?.name ?? project.organization?.name,
    formatDateRange(
      project.startDate,
      project.endDate,
      lang,
      t.projects.present,
    ),
  ].filter((item) => item != null)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground">
      <ProjectCover title={project.title} cover={project.cover} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Separate items, so mixed Arabic and Latin text never reorders across
            them. Each separator trails its item, so a wrapped line never starts with one. */}
        <p className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
          {meta.map((item, index) => (
            <span key={item} className="flex gap-x-2">
              {item}
              {index < meta.length - 1 && <span aria-hidden>·</span>}
            </span>
          ))}
        </p>
        <h2 className="text-lg font-semibold tracking-tight">
          {project.title}
        </h2>
        <p className="text-sm text-muted-foreground">{project.summary}</p>

        <div className="mt-auto flex flex-col gap-4 pt-2">
          {project.technologies.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {project.technologies.map((technology) => (
                <li
                  key={technology.slug}
                  className="rounded-sm border px-2 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {technology.name}
                </li>
              ))}
            </ul>
          )}
          {(project.liveUrl ?? project.repoUrl) && (
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
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
