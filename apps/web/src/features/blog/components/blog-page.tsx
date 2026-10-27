import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { XIcon } from 'lucide-react'

import { MetricGrid } from '@/components/content/metric-grid'
import { Page } from '@/components/layout/page'
import { PageHeader } from '@/components/layout/page-header'
import { pluralForm } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { articlesQuery } from '../blog.queries'
import { ArticleFeed } from './article-feed'

const routeApi = getRouteApi('/$lang/blog/')

const countDistinct = (slugs: string[]) => new Set(slugs).size

/**
 * The blog (DESIGN.md, "Blog list"): its numbers in the transition band, then
 * a text-first feed. A topic link on an article filters the list (?tag=).
 */
export function BlogPage() {
  const t = useTranslation()
  const lang = useLanguage()
  const { tag } = routeApi.useSearch()
  const { data: articles } = useSuspenseQuery(articlesQuery(lang))

  const stats = [
    { count: articles.length, forms: t.blog.counts.articles },
    {
      count: countDistinct(articles.flatMap((a) => a.series?.slug ?? [])),
      forms: t.blog.counts.series,
    },
    {
      count: countDistinct(
        articles.flatMap((a) => a.tags.map((articleTag) => articleTag.slug)),
      ),
      forms: t.blog.counts.topics,
    },
  ]
    .filter(({ count }) => count > 0)
    .map(({ count, forms }) => ({
      value: String(count),
      label: pluralForm(forms, count, lang),
    }))

  // Few enough articles to filter here, without another request per topic.
  const visible = tag
    ? articles.filter((article) =>
        article.tags.some((articleTag) => articleTag.slug === tag),
      )
    : articles
  const activeTag = visible
    .flatMap((article) => article.tags)
    .find((articleTag) => articleTag.slug === tag)

  return (
    <Page
      header={
        <PageHeader
          eyebrow={t.nav.blog}
          title={t.blog.title}
          lead={t.blog.description}
          strip={stats.length > 0 && <MetricGrid items={stats} />}
        />
      }
    >
      {visible.length > 0 ? (
        // One block, so the page's section line doesn't separate the topic
        // from its list. The reading width, like the articles themselves.
        <div className="flex max-w-3xl flex-col gap-10">
          {activeTag && <TopicHeading name={activeTag.name} />}
          <ArticleFeed articles={visible} />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-xl border p-8">
          <p className="text-muted-foreground">{t.blog.empty}</p>
          {tag && (
            <Link
              from="/$lang/blog/"
              to="."
              search={{}}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {t.blog.showAll}
            </Link>
          )}
        </div>
      )}
    </Page>
  )
}

/** "Topic: Arabic ✕" above a filtered list; the ✕ goes back to every article. */
function TopicHeading({ name }: { name: string }) {
  const t = useTranslation()

  return (
    <div className="flex items-center gap-3">
      <span className="mono-label">{t.blog.topic}</span>
      <p className="text-xl font-semibold tracking-tight">{name}</p>
      <Link
        from="/$lang/blog/"
        to="."
        search={{}}
        aria-label={t.blog.showAll}
        title={t.blog.showAll}
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <XIcon aria-hidden className="size-4" />
      </Link>
    </div>
  )
}
