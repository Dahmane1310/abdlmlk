import { MetaLine } from '@/components/content/meta-line'
import { formatDate } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { ArticleSummary } from '../blog.functions'

/** "Oct 27, 2026 · 6 min read · Part 3 of 3" */
export function ArticleMeta({
  article,
  className,
}: {
  article: Pick<
    ArticleSummary,
    'publishedDate' | 'readingMinutes' | 'seriesPart' | 'seriesTotal'
  >
  className?: string
}) {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <MetaLine
      className={className}
      items={[
        formatDate(article.publishedDate, lang),
        t.blog.readingTime(article.readingMinutes),
        article.seriesPart && article.seriesTotal
          ? t.blog.seriesPart(article.seriesPart, article.seriesTotal)
          : null,
      ]}
    />
  )
}
