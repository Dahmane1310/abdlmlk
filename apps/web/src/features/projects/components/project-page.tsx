import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowUpRightIcon, CodeIcon } from 'lucide-react'

import { ContentBlocks } from '@/components/content/content-blocks'
import { MetricGrid } from '@/components/content/metric-grid'
import { ResponsiveImage } from '@/components/content/responsive-image'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import { projectQuery, projectsQuery } from '../projects.queries'
import { ProjectMeta } from './project-meta'
import { ProjectNav } from './project-nav'

const routeApi = getRouteApi('/$lang/projects/$slug')

// Small uppercase label above a section, matching the site's mono details.
const SECTION_LABEL =
  'mb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase'

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

  const facts = [
    { label: t.projects.role, value: project.role },
    { label: t.projects.client, value: project.client?.name },
    { label: t.projects.builtAt, value: project.organization?.name },
  ].filter((fact) => fact.value != null)

  return (
    <article>
      <Container className="flex flex-col gap-10 py-12 md:py-16">
        <Link
          to="/$lang/projects"
          params={{ lang }}
          className="inline-flex items-center gap-1.5 self-start font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon aria-hidden className="size-4 rtl:rotate-180" />
          {t.projects.backToAll}
        </Link>

        <header className="flex max-w-3xl flex-col gap-4">
          <ProjectMeta project={project} />
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground">{project.summary}</p>
          {facts.length > 0 && (
            <dl className="mt-2 grid gap-x-10 gap-y-4 sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-xs text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {(project.liveUrl ?? project.repoUrl) && (
            <div className="mt-2 flex flex-wrap gap-3">
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
        </header>

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
          <section aria-labelledby="results-title">
            <h2 id="results-title" className={SECTION_LABEL}>
              {t.projects.results}
            </h2>
            <MetricGrid items={project.metrics} />
          </section>
        )}

        {/* grid-cols-1 is minmax(0, 1fr): without it a long code line widens
            the column past the screen instead of scrolling in its own box. */}
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
              <h2 id="tech-title" className={SECTION_LABEL}>
                {t.projects.techStack}
              </h2>
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
            </aside>
          )}
        </div>

        {project.gallery.length > 0 && (
          <section aria-labelledby="gallery-title">
            <h2 id="gallery-title" className={SECTION_LABEL}>
              {t.projects.gallery}
            </h2>
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
          </section>
        )}

        <ProjectNav previous={previous} next={next} />
      </Container>
    </article>
  )
}
