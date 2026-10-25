interface PageHeaderProps {
  /** Small label above the title: where you are, or a status. */
  eyebrow?: React.ReactNode
  title: string
  /** A mono line in the accent colour, like a person's headline. */
  subtitle?: string
  /** One or two sentences under the title. */
  lead?: string
  /** At the end of the title row, e.g. a photo. */
  media?: React.ReactNode
  /** Under the title block: facts, buttons, filters. */
  children?: React.ReactNode
}

/**
 * The header every page starts with: label, title, then a subtitle and/or a
 * lead, then anything else the page needs. One title size for every page.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  lead,
  media,
  children,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-6">
        <div className="flex max-w-3xl flex-col gap-4">
          {/* Flex, so a label with an icon (the back link) is as tall as a
              text-only one and every title starts at the same height. */}
          {eyebrow && (
            <div className="flex items-center mono-label">{eyebrow}</div>
          )}
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="font-mono text-lg text-primary">{subtitle}</p>
          )}
          {lead && <p className="text-lg text-muted-foreground">{lead}</p>}
        </div>
        {media}
      </div>
      {children}
    </header>
  )
}
