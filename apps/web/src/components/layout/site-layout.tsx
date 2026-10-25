import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { SkipLink } from './skip-link'

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <SiteHeader />
      {/* tabIndex lets the skip link move focus here, not just scroll. */}
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
