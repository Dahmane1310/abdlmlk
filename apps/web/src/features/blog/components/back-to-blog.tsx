import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

/** "← All articles": the label above an article's or a series' title. */
export function BackToBlog() {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <Link
      to="/$lang/blog"
      params={{ lang }}
      className="inline-flex items-center gap-1.5 hover:text-foreground"
    >
      <ArrowLeftIcon aria-hidden className="size-4 rtl:rotate-180" />
      {t.blog.backToAll}
    </Link>
  )
}
