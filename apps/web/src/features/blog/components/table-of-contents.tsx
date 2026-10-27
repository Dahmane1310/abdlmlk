import { useEffect, useState } from 'react'

import type { Heading } from '@/lib/markdown/heading-ids'
import { useTranslation } from '@/lib/i18n/use-translation'

/**
 * The heading being read: the last one that has scrolled past the top quarter
 * of the screen, or the first before any has. Measured on scroll, at most
 * once a frame.
 */
function useCurrentHeading(headings: Heading[]) {
  const [current, setCurrent] = useState(headings.at(0)?.id)

  useEffect(() => {
    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element) => element !== null)
    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight / 4
      const passed = elements.filter(
        (element) => element.getBoundingClientRect().top <= line,
      )
      setCurrent((passed.at(-1) ?? elements.at(0))?.id)
    }
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(measure)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [headings])

  return current
}

/**
 * An article's sections (DESIGN.md, "Article page"), beside the text on wide
 * screens and following the reader down the page. The section being read is
 * marked like the current page in the menu: foreground, with a 2px blue line.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const t = useTranslation()
  const current = useCurrentHeading(headings)

  return (
    <nav aria-labelledby="toc-title" className="flex flex-col gap-3">
      <p id="toc-title" className="mono-label">
        {t.blog.contents}
      </p>
      <ul className="flex flex-col">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={id === current ? 'location' : undefined}
              className="block border-s-2 border-transparent py-1.5 ps-3.5 text-sm leading-snug text-muted-foreground hover:text-foreground aria-[current=location]:border-primary aria-[current=location]:text-foreground"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
