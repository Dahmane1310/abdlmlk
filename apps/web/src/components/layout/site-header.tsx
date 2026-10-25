import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { siteSettingsQuery } from '@/features/site/site.queries'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { Container } from './container'
import { LanguageSwitcher } from './language-switcher'
import { MobileMenu } from './mobile-menu'
import { NAV_ITEMS } from './nav-items'
import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
  const t = useTranslation()
  const lang = useLanguage()
  const { data: site } = useSuspenseQuery(siteSettingsQuery(lang))

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <Container className="flex h-14 items-center gap-6">
        <Link
          to="/$lang"
          params={{ lang }}
          className="font-mono text-sm font-medium tracking-tight"
        >
          {site.siteName}
        </Link>

        <nav aria-label={t.layout.mainNavigation} className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  params={{ lang }}
                  activeOptions={{ exact: item.exact }}
                  className="text-muted-foreground hover:text-foreground data-[status=active]:text-foreground"
                >
                  {t.nav[item.label]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </Container>
    </header>
  )
}
