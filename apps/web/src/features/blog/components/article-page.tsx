import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { ContentBlocks } from '@/components/content/content-blocks'
import { Page } from '@/components/layout/page'
import { PageHeader } from '@/components/layout/page-header'
import { useTranslation } from '@/lib/i18n/use-translation'

import { articleQuery } from '../blog.queries'
import { ArticleMeta } from './article-meta'

const routeApi = getRouteApi('/$lang/blog/$slug')

/**
 * An article, in a first, plain version: the header, then the blocks at the
 * reading width. The reading layout (typeface, byline, table of contents,
 * progress bar) is the next step.
 */
export function ArticlePage() {
  const t = useTranslation()
  const { lang, slug } = routeApi.useParams()
  const { data: article } = useSuspenseQuery(articleQuery(lang, slug))

  return (
    <article>
      <Page
        header={
          <PageHeader
            eyebrow={
              <Link
                to="/$lang/blog"
                params={{ lang }}
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <ArrowLeftIcon aria-hidden className="size-4 rtl:rotate-180" />
                {t.blog.backToAll}
              </Link>
            }
            title={article.title}
            lead={article.description ?? undefined}
          >
            <ArticleMeta
              article={{ ...article, seriesTotal: null }}
              className="text-[0.8125rem]"
            />
          </PageHeader>
        }
      >
        {/* min-w-0 keeps a long code line scrolling inside its block
            instead of widening the page. */}
        <ContentBlocks blocks={article.blocks} className="max-w-3xl min-w-0" />
      </Page>
    </article>
  )
}
