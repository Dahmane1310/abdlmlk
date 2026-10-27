import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { ContentBlocks } from '@/components/content/content-blocks'
import { ResponsiveImage } from '@/components/content/responsive-image'
import { Page } from '@/components/layout/page'
import { PageHeader } from '@/components/layout/page-header'
import { useTranslation } from '@/lib/i18n/use-translation'

import { articleQuery } from '../blog.queries'
import { ArticleByline } from './article-byline'

const routeApi = getRouteApi('/$lang/blog/$slug')

/**
 * An article (DESIGN.md, "Article page"): the header with the title and
 * subtitle, the byline in the transition band, then the cover and the text
 * in a Medium-like reading column.
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
            size="article"
            strip={<ArticleByline article={article} />}
          />
        }
      >
        {/* One block, so no section line comes between the cover and the text. */}
        <div className="flex flex-col gap-14">
          {article.cover && (
            <ResponsiveImage
              image={article.cover}
              sizes="(min-width: 1024px) 61rem, 100vw"
              priority
              className="aspect-video w-full rounded-xl border object-cover"
            />
          )}
          {/* "reading" sets the article typography (app.css). The column is
              about 680px, Medium's line length; min-w-0 keeps a long code
              line scrolling inside its block instead of widening the page. */}
          <ContentBlocks
            blocks={article.blocks}
            className="reading max-w-170 min-w-0"
          />
        </div>
      </Page>
    </article>
  )
}
