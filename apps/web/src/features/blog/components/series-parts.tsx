import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { Article } from '../blog.functions'

/**
 * The series an article belongs to (DESIGN.md, "Article page"), after the
 * text: every part in order, the one being read marked like the contents,
 * and the one after it called out as next.
 */
export function SeriesParts({
  series,
  current,
}: {
  series: NonNullable<Article['series']>
  /** The slug of the article being read. */
  current: string
}) {
  const t = useTranslation()
  const lang = useLanguage()
  const parts = series.articles ?? []
  const index = parts.findIndex((part) => part.slug === current)
  const next = index === -1 ? undefined : parts.at(index + 1)

  return (
    <nav
      aria-labelledby="series-label series-title"
      className="flex flex-col gap-4 rounded-xl border p-6"
    >
      <div className="flex flex-col gap-1">
        <p id="series-label" className="mono-label">
          {t.blog.series}
        </p>
        <p id="series-title" className="text-lg font-semibold tracking-tight">
          {series.title}
        </p>
      </div>
      <ol className="flex flex-col">
        {parts.map((part, position) => (
          <li key={part.slug}>
            {/* The router marks the current part's link with aria-current="page". */}
            <Link
              to="/$lang/blog/$slug"
              params={{ lang, slug: part.slug }}
              className="flex items-baseline gap-3 border-s-2 border-transparent py-2 ps-3.5 text-muted-foreground hover:text-foreground aria-[current=page]:border-primary aria-[current=page]:text-foreground"
            >
              <span className="font-mono text-sm">
                {part.seriesPart ?? position + 1}
              </span>
              <span className="font-medium">{part.title}</span>
              {part === next && (
                <span className="ms-auto inline-flex shrink-0 items-center gap-1 font-mono text-xs text-primary">
                  {t.blog.nextPart}
                  <ArrowRightIcon
                    aria-hidden
                    className="size-3.5 rtl:rotate-180"
                  />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
