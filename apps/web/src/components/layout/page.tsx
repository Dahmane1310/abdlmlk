import { cn } from '@/lib/utils'

import { ContactBand } from './contact-band'
import { Container } from './container'

// The space around and between sections (DESIGN.md, "Spacing"), as a
// variable so the dividers can sit midway (app.css, section-dividers).
// "document" is tighter, for a page that reads as one document (About).
const SPACING = {
  page: '[--section-gap:7rem] py-24 md:[--section-gap:8rem] md:py-28',
  document: '[--section-gap:5rem] py-20',
}

/**
 * Every page's frame (DESIGN.md, "Page anatomy"): the header's blueprint band
 * across the full width, then the sections at the site width with a
 * full-width line between them, closed by the contact band.
 */
export function Page({
  header,
  spacing = 'page',
  children,
}: {
  /** The page's PageHeader. */
  header: React.ReactNode
  spacing?: keyof typeof SPACING
  children?: React.ReactNode
}) {
  return (
    <>
      {header}
      <Container
        className={cn('flex flex-col gap-(--section-gap)', SPACING[spacing])}
      >
        {/* "contents": the sections stay spaced like the contact band; the
            wrapper only gives the dividers their own first child. */}
        <div className="section-dividers contents">{children}</div>
        <ContactBand />
      </Container>
    </>
  )
}
