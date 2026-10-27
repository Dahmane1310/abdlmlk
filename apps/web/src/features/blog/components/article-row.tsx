import { Link } from '@tanstack/react-router'

import { ResponsiveImage } from '@/components/content/responsive-image'
import { useLanguage } from '@/lib/i18n/use-language'

import type { ArticleSummary } from '../blog.functions'
import { ArticleMeta } from './article-meta'
import { TopicLinks } from './topic-links'

/**
 * One article in the blog feed (DESIGN.md, "Blog list"): the date, reading
 * time and series part, the title, the description and the topics, with a
 * small cover on the end side when there is one. Like the project cards, the
 * title link covers the whole row; the topic links sit above it.
 */
export function ArticleRow({ article }: { article: ArticleSummary }) {
  const lang = useLanguage()

  return (
    <article className="group relative flex gap-8 rounded-sm has-[h2_a:focus-visible]:ring-[3px] has-[h2_a:focus-visible]:ring-ring/50 has-[h2_a:focus-visible]:ring-offset-8 has-[h2_a:focus-visible]:ring-offset-background">
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <ArticleMeta article={article} />
        <h2 className="text-2xl leading-snug font-semibold tracking-tight">
          <Link
            to="/$lang/blog/$slug"
            params={{ lang, slug: article.slug }}
            className="decoration-1 underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0"
          >
            {article.title}
          </Link>
        </h2>
        {article.description && (
          <p className="line-clamp-2 text-[1.0625rem] text-muted-foreground">
            {article.description}
          </p>
        )}
        {/* Above the row's link (z-10), so the topics stay clickable. */}
        <TopicLinks
          tags={article.tags}
          className="relative z-10 mt-1 self-start"
        />
      </div>
      {article.cover && (
        <ResponsiveImage
          image={article.cover}
          sizes="10rem"
          className="hidden aspect-4/3 w-40 shrink-0 self-start rounded-md border object-cover sm:block"
        />
      )}
    </article>
  )
}
