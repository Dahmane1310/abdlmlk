/** A page section with a numbered title (the numbering lives in app.css, .section-title). */
export function PageSection({
  id,
  title,
  action,
  children,
}: {
  /** Unique on the page: the section's id, for links to it, and its title's. */
  id: string
  title: string
  /** At the end of the title row, e.g. an "All projects" ArrowLink. */
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    // scroll-mt: a link to the section stops below the sticky site header.
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 id={`${id}-title`} className="section-title">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
