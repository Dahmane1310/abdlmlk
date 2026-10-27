import { useSuspenseQuery } from '@tanstack/react-query'

import { SiteMark } from '@/components/layout/site-mark'
import { profileQuery } from '@/features/profile/profile.queries'
import { useLanguage } from '@/lib/i18n/use-language'

import type { Article } from '../blog.functions'
import { ArticleMeta } from './article-meta'
import { TopicLinks } from './topic-links'

/**
 * The byline in an article's transition band (DESIGN.md, "Article page"):
 * the site mark and the author, the date, reading time and series part, and
 * the article's topics on the end side.
 */
export function ArticleByline({ article }: { article: Article }) {
  const lang = useLanguage()
  // Loaded for the layout on every page, so already cached.
  const { data: profile } = useSuspenseQuery(profileQuery(lang))

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-6">
      <div className="flex items-center gap-3.5">
        <SiteMark
          name={profile.fullName}
          className="size-10 rounded-md text-[0.8125rem]"
        />
        <div className="flex flex-col gap-1">
          <p className="text-[0.9375rem] font-medium">{profile.fullName}</p>
          <ArticleMeta article={article} />
        </div>
      </div>
      <TopicLinks tags={article.tags} />
    </div>
  )
}
