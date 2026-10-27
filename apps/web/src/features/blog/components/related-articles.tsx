import { Link } from '@tanstack/react-router'
import { useId } from 'react'

import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { ArticleSummary } from '../blog.functions'
import { ArticleMeta } from './article-meta'

/**
 * "More to read" at the very end of an article (DESIGN.md, "Article page"):
 * compact rows, the date and reading time above each title. Hidden when
 * there's nothing outside the article's own series.
 */
export function RelatedArticles({ articles }: { articles: ArticleSummary[] }) {
  const t = useTranslation()
  const lang = useLanguage()
  const titleId = useId()

  if (articles.length === 0) return null

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-8">
      <h2 id={titleId} className="text-2xl font-semibold tracking-tight">
        {t.blog.moreToRead}
      </h2>
      <ul className="flex flex-col gap-7">
        {articles.map((article) => (
          <li key={article.slug} className="flex flex-col gap-1.5">
            <ArticleMeta article={article} />
            <Link
              to="/$lang/blog/$slug"
              params={{ lang, slug: article.slug }}
              className="text-lg leading-snug font-semibold tracking-tight decoration-1 underline-offset-4 hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
