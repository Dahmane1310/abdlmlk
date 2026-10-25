import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowUpRightIcon, CodeIcon } from 'lucide-react'

import { ContentBlocks } from '@/components/content/content-blocks'
import { FactsStrip } from '@/components/content/facts-strip'
import { MetricGrid } from '@/components/content/metric-grid'
import { ResponsiveImage } from '@/components/content/responsive-image'
import { TechList } from '@/components/content/tech-list'
import { Page } from '@/components/layout/page'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { Button } from '@/components/ui/button'
import { formatDateRange } from '@/lib/i18n/format'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import { projectQuery, projectsQuery } from '../projects.queries'
import { ProjectNav } from './project-nav'

const routeApi = getRouteApi('/$lang/projects/$slug')

export function ProjectPage() {
  const t = useTranslation()
  const { lang, slug } = routeApi.useParams()
  const { data: project } = useSuspenseQuery(projectQuery(lang, slug))
  const { data: projects } = useSuspenseQuery(projectsQuery(lang))

  const index = projects.findIndex((item) => item.slug === slug)
  const previous = index > 0 ? projects[index - 1] : undefined
  const next =
    index !== -1 && index < projects.length - 1
      ? projects[index + 1]
      : undefined

  const dates = formatDateRange(
    project.startDate,
    project.endDate,
    lang,
    t.dates.present,
  )
  const facts = [
    { label: t.projects.type, value: t.projects.types[project.projectType] },
    project.client
      ? { label: t.projects.client, value: project.client.name }
      : null,
    project.organization
      ? { label: t.projects.builtAt, value: project.organization.name }
      : null,
    project.role ? { label: t.projects.role, value: project.role } : null,
    dates ? { label: t.projects.dates, value: dates } : null,
  ].filter((fact) => fact != null)

  return (
    <article>
      <Page>
        <PageHeader
          eyebrow={
            <Link
              to="/$lang/projects"
              params={{ lang }}
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <ArrowLeftIcon aria-hidden className="size-4 rtl:rotate-180" />
              {t.projects.backToAll}
            </Link>
          }
          title={project.title}
          lead={project.summary}
        >
          <FactsStrip facts={facts} />
          {(project.liveUrl ?? project.repoUrl) && (
            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <Button asChild>
                  <a href={project.liveUrl}>
                    {t.projects.visitSite}
                    <ArrowUpRightIcon
                      aria-hidden
                      className="rtl:-scale-x-100"
                    />
                  </a>
                </Button>
              )}
              {project.repoUrl && (
                <Button asChild variant="outline">
                  <a href={project.repoUrl}>
                    <CodeIcon aria-hidden />
                    {t.projects.sourceCode}
                  </a>
                </Button>
              )}
            </div>
          )}
        </PageHeader>

        {/* No placeholder here: the title right above already says what the
            project is, so an empty cover would only push the story down. */}
        {project.cover && (
          <ResponsiveImage
            image={project.cover}
            sizes="(min-width: 1024px) 61rem, 100vw"
            priority
            className="aspect-16/10 w-full rounded-xl border object-cover"
          />
        )}

        {project.metrics.length > 0 && (
          <PageSection id="key-numbers" title={t.projects.keyNumbers}>
            <MetricGrid items={project.metrics} />
          </PageSection>
        )}

        {/* The case study's own Markdown headings are numbered sections too
            (app.css). grid-cols-1 is minmax(0, 1fr): without it a long code
            line widens the column past the screen instead of scrolling. */}
        <div
          className={cn(
            'grid grid-cols-1 gap-12',
            project.technologies.length > 0 &&
              'lg:grid-cols-[minmax(0,1fr)_14rem]',
          )}
        >
          {/* Capped at a comfortable line length, like the header above. */}
          <ContentBlocks blocks={project.content} className="max-w-3xl" />
          {project.technologies.length > 0 && (
            <aside aria-labelledby="tech-title">
              {/* A side panel's label, not a numbered page section. */}
              <h2 id="tech-title" className="mb-4 mono-label">
                {t.projects.techStack}
              </h2>
              <TechList technologies={project.technologies} />
            </aside>
          )}
        </div>

        {project.gallery.length > 0 && (
          <PageSection id="gallery" title={t.projects.gallery}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {project.gallery.map((image) => (
                <li key={image.url}>
                  <ResponsiveImage
                    image={image}
                    sizes="(min-width: 1024px) 30rem, (min-width: 640px) 50vw, 100vw"
                    className="aspect-16/10 w-full rounded-xl border object-cover"
                  />
                </li>
              ))}
            </ul>
          </PageSection>
        )}

        <ProjectNav previous={previous} next={next} />
      </Page>
    </article>
  )
}
