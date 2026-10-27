import type { ArticleSummary } from '../blog.functions'
import { ArticleRow } from './article-row'

/** Articles as the blog list shows them (DESIGN.md, "Blog list"), 56px apart. */
export function ArticleFeed({ articles }: { articles: ArticleSummary[] }) {
  return (
    <ul className="flex flex-col gap-14">
      {articles.map((article) => (
        <li key={article.slug}>
          <ArticleRow article={article} />
        </li>
      ))}
    </ul>
  )
}
