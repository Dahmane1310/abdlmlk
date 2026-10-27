import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { MetricGrid } from '@/components/content/metric-grid'
import { Page } from '@/components/layout/page'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { pluralForm } from '@/lib/i18n/format'
import { useTranslation } from '@/lib/i18n/use-translation'

import { articlesQuery, seriesQuery } from '../blog.queries'
import { ArticleFeed } from './article-feed'
import { BackToBlog } from './back-to-blog'

const routeApi = getRouteApi('/$lang/blog/series/$slug')

/**
 * A series (DESIGN.md, "Series page"): its title and description with a
 * button to the first part, its numbers in the transition band, then its
 * parts in order as the blog list's rows.
 */
export function SeriesPage() {
  const t = useTranslation()
  const { lang, slug } = routeApi.useParams()
  const { data: series } = useSuspenseQuery(seriesQuery(lang, slug))
  const { data: articles } = useSuspenseQuery(articlesQuery(lang))

  // In the series card's order: by part, as Strapi sorts them there.
  const parts = articles
    .filter((article) => article.series?.slug === slug)
    .sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0))
  const first = parts.at(0)
  const minutes = parts.reduce((sum, part) => sum + part.readingMinutes, 0)

  return (
    <Page
      header={
        <PageHeader
          eyebrow={<BackToBlog />}
          title={series.title}
          lead={series.description ?? undefined}
          strip={
            parts.length > 0 && (
              <MetricGrid
                items={[
                  {
                    value: String(parts.length),
                    label: pluralForm(t.blog.counts.parts, parts.length, lang),
                  },
                  {
                    value: String(minutes),
                    label: pluralForm(t.blog.counts.minutes, minutes, lang),
                  },
                ]}
              />
            )
          }
        >
          {first && (
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link
                  to="/$lang/blog/$slug"
                  params={{ lang, slug: first.slug }}
                >
                  {t.blog.startSeries}
                  <ArrowRightIcon aria-hidden className="rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          )}
        </PageHeader>
      }
    >
      {parts.length > 0 ? (
        // The reading width, like the blog list.
        <div className="max-w-3xl">
          <ArticleFeed articles={parts} />
        </div>
      ) : (
        <div className="rounded-xl border p-8">
          <p className="text-muted-foreground">{t.blog.empty}</p>
        </div>
      )}
    </Page>
  )
}
