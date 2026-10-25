/** A page section with a numbered title (the numbering lives in app.css, .section-title). */
export function PageSection({
  id,
  title,
  children,
}: {
  /** Unique on the page; the title's id is derived from it. */
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="section-title">
        {title}
      </h2>
      {children}
    </section>
  )
}
