import { useEffect, useRef } from 'react'

/**
 * A thin blue bar along the top of the screen that fills as the article's
 * text is read (DESIGN.md, "Article page"). Decorative: the scrollbar says
 * the same. It's updated directly, at most once a frame, rather than through
 * React state, so scrolling never re-renders the page.
 */
export function ReadingProgress({
  target,
}: {
  /** The article's text: progress goes from its top to its end. */
  target: React.RefObject<HTMLElement | null>
}) {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const text = target.current
      if (!text || !bar.current) return
      const { top, height } = text.getBoundingClientRect()
      const distance = height - window.innerHeight
      const progress =
        distance > 0 ? Math.min(Math.max(-top / distance, 0), 1) : 1
      // The CSS `scale` property, which Tailwind's scale-x-0 uses too.
      bar.current.style.scale = `${String(progress)} 1`
    }
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(measure)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [target])

  return (
    <div
      ref={bar}
      aria-hidden
      // Fills from the start edge: the left, or the right in Arabic.
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-primary rtl:origin-right"
    />
  )
}
