import { cn } from '@/lib/utils'

import { Container } from './container'

// The home page's title is one step larger; an article's, a sentence long,
// two steps smaller (DESIGN.md, "Type scale").
const TITLE_SIZES = {
  page: 'text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04]',
  hero: 'text-[clamp(2.75rem,7vw,5.25rem)] leading-[1.02]',
  article: 'text-[clamp(2.125rem,4.5vw,3.25rem)] leading-[1.1]',
}

interface PageHeaderProps {
  /** Small label above the title: where you are, or a status. */
  eyebrow?: React.ReactNode
  title: string
  /** A mono line in the accent colour, like a person's headline. */
  subtitle?: string
  /** One or two sentences under the title. */
  lead?: string
  /** "hero" for the home page's larger title, "article" for an article's. */
  size?: keyof typeof TITLE_SIZES
  /**
   * The page's figures or controls (FactsStrip, MetricGrid, filters), shown
   * in the transition band below the grid.
   */
  strip?: React.ReactNode
  /** Under the title block: the page's buttons. */
  children?: React.ReactNode
}

/**
 * The header every page starts with (DESIGN.md): the blueprint band with the
 * label, the title, a subtitle and/or a lead, then the page's buttons or
 * filters; then, when the page has one, its strip in a solid transition band
 * between the grid and the plain page below.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  lead,
  size = 'page',
  strip,
  children,
}: PageHeaderProps) {
  return (
    <header>
      {/* Full width, so the grid runs edge to edge behind the content. */}
      <div className="border-b blueprint">
        <Container className="flex flex-col gap-10 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="flex max-w-3xl flex-col gap-6">
            {/* Flex, so a label with an icon (the back link) is as tall as a
                text-only one and every title starts at the same height. */}
            {eyebrow && (
              <div className="flex items-center mono-label">{eyebrow}</div>
            )}
            <h1
              className={cn(
                'font-semibold tracking-[-0.035em]',
                TITLE_SIZES[size],
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="font-mono text-lg text-primary">{subtitle}</p>
            )}
            {lead && (
              <p className="max-w-2xl text-xl leading-relaxed">{lead}</p>
            )}
          </div>
          {children}
        </Container>
      </div>
      {strip && (
        <div className="border-b bg-muted">
          <Container>{strip}</Container>
        </div>
      )}
    </header>
  )
}
