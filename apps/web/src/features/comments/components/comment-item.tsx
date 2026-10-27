import { useSuspenseQuery } from '@tanstack/react-query'

import { SiteMark } from '@/components/layout/site-mark'
import { profileQuery } from '@/features/profile/profile.queries'
import { formatDate } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'
import { initials } from '@/lib/initials'

import type { ArticleComment } from '../comments.schema'

/**
 * One response (DESIGN.md, "Article page"): initials in a circle, the name
 * and date, then the text as written. The owner's replies carry the site mark
 * and an "Author" label. dir="auto" lets an English response on an Arabic
 * page read left to right, and the other way round.
 */
export function CommentItem({ comment }: { comment: ArticleComment }) {
  const t = useTranslation()
  const lang = useLanguage()
  // Already loaded for the article's byline.
  const { data: profile } = useSuspenseQuery(profileQuery(lang))

  return (
    <article className="flex gap-4">
      {comment.isAuthorReply ? (
        <SiteMark name={profile.fullName} className="size-10 text-xs" />
      ) : (
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-medium text-muted-foreground"
        >
          {initials(comment.authorName)}
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1.5">
        <header className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <p dir="auto" className="font-medium">
            {comment.authorName}
          </p>
          {comment.isAuthorReply && (
            <span className="mono-label text-primary">{t.comments.author}</span>
          )}
          <time
            dateTime={comment.createdAt}
            className="font-mono text-xs text-muted-foreground"
          >
            {formatDate(comment.createdAt, lang)}
          </time>
        </header>
        <p
          dir="auto"
          className="leading-relaxed break-words whitespace-pre-line"
        >
          {comment.body}
        </p>
      </div>
    </article>
  )
}
