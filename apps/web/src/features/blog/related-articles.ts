import type { ArticleSummary } from './blog.functions'
import type { Tag } from './blog.schema'

const RELATED_COUNT = 3

/**
 * Up to three articles to read next (DESIGN.md, "Article page"): never the
 * article itself or its series' parts, which the series card already lists;
 * the ones sharing the most topics first, then the newest of the rest.
 */
export function pickRelated(
  article: { slug: string; tags: Tag[]; series: { slug: string } | null },
  articles: ArticleSummary[],
) {
  const topics = new Set(article.tags.map((tag) => tag.slug))
  const shared = (other: ArticleSummary) =>
    other.tags.filter((tag) => topics.has(tag.slug)).length

  return (
    articles
      .filter(
        (other) =>
          other.slug !== article.slug &&
          (!article.series || other.series?.slug !== article.series.slug),
      )
      // The list comes newest first and sort() keeps equal scores in order,
      // so ties, and articles sharing no topic, stay newest first.
      .sort((a, b) => shared(b) - shared(a))
      .slice(0, RELATED_COUNT)
  )
}
