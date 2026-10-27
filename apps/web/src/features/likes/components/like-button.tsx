import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HeartIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { pluralForm } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'
import { postToStrapi } from '@/lib/strapi/public-api'
import { cn } from '@/lib/utils'

import { likesQuery } from '../likes.queries'
import { likeResultSchema } from '../likes.schema'
import { useStoredLike } from '../stored-like'

/**
 * The like button (DESIGN.md, "Article page"): a heart the reader turns on
 * and off, one like per reader. The total beside it counts the article's
 * languages together.
 */
export function LikeButton({ article }: { article: string }) {
  const t = useTranslation()
  const lang = useLanguage()
  const queryClient = useQueryClient()
  const { queryKey } = likesQuery(article)
  const { data: total } = useQuery(likesQuery(article))
  const { liked, setLiked } = useStoredLike(article)
  const mutationKey = ['like', article]

  const { mutate } = useMutation({
    mutationKey,
    // One request at a time, in click order, so a quick like then unlike
    // can't reach the CMS the other way round.
    scope: { id: `like:${article}` },
    mutationFn: (next: boolean) =>
      postToStrapi(
        '/likes',
        { article, locale: lang, liked: next },
        likeResultSchema,
      ),
    // Only the last of several quick clicks sets the total, so it doesn't
    // flick back to an in-between number.
    onSuccess: ({ data }) => {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.setQueryData(queryKey, data.total)
      }
    },
    // Not saved (too many requests, CMS down): undo it.
    onError: (_error, next) => {
      setLiked(!next)
      void queryClient.invalidateQueries({ queryKey })
    },
  })

  const toggle = () => {
    const next = !liked
    setLiked(next)
    queryClient.setQueryData(queryKey, (current) =>
      Math.max((current ?? 0) + (next ? 1 : -1), 0),
    )
    mutate(next)
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon-lg"
        onClick={toggle}
        aria-label={t.blog.like}
        aria-pressed={liked}
        className={cn(
          'size-12 rounded-full text-muted-foreground hover:text-foreground',
          // A filled blue heart once the reader likes it.
          liked &&
            'border-primary text-primary hover:text-primary dark:border-primary',
        )}
      >
        <HeartIcon
          aria-hidden
          className={cn('size-5', liked && 'fill-current')}
        />
      </Button>
      {total ? (
        <p className="font-mono text-sm text-muted-foreground">
          {total}
          <span className="sr-only">
            {' '}
            {pluralForm(t.blog.counts.likes, total, lang)}
          </span>
        </p>
      ) : null}
    </div>
  )
}
