import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useRef } from 'react'

import { ContentBlocks } from '@/components/content/content-blocks'
import { ResponsiveImage } from '@/components/content/responsive-image'
import { Page } from '@/components/layout/page'
import { PageHeader } from '@/components/layout/page-header'
import { CommentSection } from '@/features/comments/components/comment-section'
import { ResponsesLink } from '@/features/comments/components/responses-link'
import { LikeButton } from '@/features/likes/components/like-button'
import { cn } from '@/lib/utils'

import { articleQuery } from '../blog.queries'
import { ArticleByline } from './article-byline'
import { BackToBlog } from './back-to-blog'
import { ReadingProgress } from './reading-progress'
import { SeriesParts } from './series-parts'
import { TableOfContents } from './table-of-contents'

const routeApi = getRouteApi('/$lang/blog/$slug')

/**
 * An article (DESIGN.md, "Article page"): the header with the title and
 * subtitle, the byline in the transition band, then the cover and the text
 * in a Medium-like reading column, followed by the series' parts when the
 * article belongs to one.
 */
export function ArticlePage() {
  const { lang, slug } = routeApi.useParams()
  const { data: article } = useSuspenseQuery(articleQuery(lang, slug))
  const text = useRef<HTMLDivElement>(null)
  // A single section needs no contents.
  const showContents = article.headings.length > 1

  return (
    <article>
      <Page
        header={
          <PageHeader
            eyebrow={<BackToBlog />}
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
          <div
            className={cn(
              'grid grid-cols-1 gap-x-16',
              showContents && 'lg:grid-cols-[minmax(0,42.5rem)_minmax(0,1fr)]',
            )}
          >
            {/* "reading" sets the article typography (app.css). The column is
                about 680px, Medium's line length; min-w-0 keeps a long code
                line scrolling inside its block instead of widening the page. */}
            <div className="flex max-w-170 min-w-0 flex-col gap-14">
              {/* The progress bar measures the text alone, not the card after it. */}
              <div ref={text}>
                <ContentBlocks
                  blocks={article.blocks}
                  className="reading min-w-0"
                />
              </div>
              <div className="flex items-center gap-6">
                <LikeButton article={article.documentId} />
                <ResponsesLink article={article.documentId} />
              </div>
              {article.series && (
                <SeriesParts series={article.series} current={article.slug} />
              )}
              <CommentSection
                article={article.documentId}
                // Open unless the owner closed them (the CMS's rule too).
                allowComments={article.allowComments !== false}
              />
            </div>
            {showContents && (
              // Wide screens only: on a phone it would push the text down.
              <div className="hidden lg:block">
                <div className="sticky top-28">
                  <TableOfContents headings={article.headings} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Page>
      <ReadingProgress target={text} />
    </article>
  )
}
