import { useQuery } from '@tanstack/react-query'

import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { commentsQuery } from '../comments.queries'
import { countComments } from '../threads'
import { CommentItem } from './comment-item'

/** The id the responses link beside the like button jumps to. */
export const RESPONSES_ID = 'responses'

/**
 * An article's responses (DESIGN.md, "Article page"), after the series card:
 * every approved response, oldest first, with its replies indented under it.
 * Loaded in the browser after the page, so new approvals show without the
 * article's cache having to change.
 */
export function CommentSection({ article }: { article: string }) {
  const t = useTranslation()
  const lang = useLanguage()
  const { data: threads, isError } = useQuery(commentsQuery(article, lang))

  return (
    // scroll-mt keeps the title clear of the sticky header after the jump.
    <section
      id={RESPONSES_ID}
      aria-labelledby="responses-title"
      className="flex scroll-mt-24 flex-col gap-8"
    >
      <h2
        id="responses-title"
        className="text-2xl font-semibold tracking-tight"
      >
        {t.comments.title}
        {threads && threads.length > 0 && (
          <span className="ms-2 font-mono text-lg font-normal text-muted-foreground">
            ({countComments(threads)})
          </span>
        )}
      </h2>
      {isError && (
        <p className="text-muted-foreground">{t.comments.unavailable}</p>
      )}
      {threads?.length === 0 && (
        <p className="text-muted-foreground">{t.comments.empty}</p>
      )}
      {threads && threads.length > 0 && (
        <ol className="flex flex-col gap-10">
          {threads.map(({ comment, replies }) => (
            <li key={comment.documentId} className="flex flex-col gap-6">
              <CommentItem comment={comment} />
              {replies.length > 0 && (
                // Indented under the response's avatar, with a line on the
                // start edge like the site's quotes.
                <ol className="ms-5 flex flex-col gap-6 border-s ps-6">
                  {replies.map((reply) => (
                    <li key={reply.documentId}>
                      <CommentItem comment={reply} />
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
