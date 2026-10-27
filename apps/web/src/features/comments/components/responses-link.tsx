import { useQuery } from '@tanstack/react-query'
import { MessageCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { pluralForm } from '@/lib/i18n/format'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { commentsQuery } from '../comments.queries'
import { countComments } from '../threads'
import { RESPONSES_ID } from './comment-section'

/**
 * Beside the like button: a speech bubble that jumps to the responses, with
 * how many there are. Shares the responses' query, so it costs no request.
 */
export function ResponsesLink({ article }: { article: string }) {
  const t = useTranslation()
  const lang = useLanguage()
  const { data: threads } = useQuery(commentsQuery(article, lang))
  const count = threads ? countComments(threads) : 0

  return (
    <div className="flex items-center gap-3">
      <Button
        asChild
        variant="outline"
        size="icon-lg"
        className="size-12 rounded-full text-muted-foreground hover:text-foreground"
      >
        <a href={`#${RESPONSES_ID}`} aria-label={t.comments.title}>
          <MessageCircleIcon aria-hidden className="size-5" />
        </a>
      </Button>
      {count > 0 && (
        <p className="font-mono text-sm text-muted-foreground">
          {count}
          <span className="sr-only">
            {' '}
            {pluralForm(t.comments.counts, count, lang)}
          </span>
        </p>
      )}
    </div>
  )
}
