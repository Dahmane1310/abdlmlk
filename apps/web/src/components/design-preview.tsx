// Temporary: shows the design tokens before real pages exist. Deleted in phase 2.

const SWATCHES = [
  { name: 'background', className: 'bg-background' },
  { name: 'foreground', className: 'bg-foreground' },
  { name: 'card', className: 'bg-card' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'muted-foreground', className: 'bg-muted-foreground' },
  { name: 'accent', className: 'bg-accent' },
  { name: 'border', className: 'bg-border' },
  { name: 'input', className: 'bg-input' },
  { name: 'primary', className: 'bg-primary' },
  { name: 'destructive', className: 'bg-destructive' },
]

const TECH = ['Laravel', 'React', 'PostgreSQL', 'Docker']

export function DesignPreview() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <ThemePanel theme="light" />
      <div className="dark">
        <ThemePanel theme="dark" />
      </div>
    </main>
  )
}

function ThemePanel({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <section
      aria-labelledby={`${theme}-title`}
      className="flex h-full flex-col gap-10 bg-background p-8 text-foreground"
    >
      <header className="flex items-center justify-between border-b pb-4">
        <h2 id={`${theme}-title`} className="font-mono text-sm uppercase">
          {theme} theme
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          tokens preview
        </span>
      </header>

      <div>
        <h3 className="mb-3 font-mono text-xs text-muted-foreground uppercase">
          Colours
        </h3>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {SWATCHES.map((swatch) => (
            <li key={swatch.name} className="space-y-1">
              <div className={`h-10 rounded-md border ${swatch.className}`} />
              <p className="font-mono text-[11px] text-muted-foreground">
                {swatch.name}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Full-stack engineer · 2024 — present
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Dahmane Abdelmalek
        </h1>
        <p className="max-w-prose text-muted-foreground">
          I build stable, well-architected applications. I work independently
          across the stack and prioritize sustainable solutions that deliver
          business value.
        </p>
        <p>
          Read the{' '}
          <a
            href="https://github.com/Dahmane1310"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            GitHub profile
          </a>{' '}
          or run <code className="font-mono text-sm">pnpm dev</code>.
        </p>
        <p lang="fr">
          Ingénieur full-stack — conçu, testé, déployé, livré à l’heure.
        </p>
        <p lang="ar" dir="rtl" className="leading-7">
          مهندس Full-Stack أبني تطبيقات مستقرة ومُصمَّمة بعناية، وأُعطي الأولوية
          للحلول المستدامة. علامة 19/20 في مشروع التخرّج.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <button
          type="button"
          className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Contact me
        </button>
        <button
          type="button"
          className="h-9 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Download CV
        </button>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${theme}-email`} className="text-sm font-medium">
            Email
          </label>
          <input
            id={`${theme}-email`}
            type="email"
            placeholder="you@example.com"
            className="h-9 w-56 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          />
        </div>
      </div>

      <article className="space-y-3 rounded-xl border bg-card p-5 text-card-foreground">
        <p className="font-mono text-xs text-muted-foreground">
          2024-08 → 2024-12 · Five Angles
        </p>
        <h3 className="text-lg font-semibold">Ayama</h3>
        <p className="text-sm text-muted-foreground">
          Internal management platform for a donation platform. I led backend
          development for operations tracking and the admin tools.
        </p>
        <ul className="flex flex-wrap gap-2">
          {TECH.map((name) => (
            <li
              key={name}
              className="rounded-sm border px-2 py-0.5 font-mono text-xs text-muted-foreground"
            >
              {name}
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
