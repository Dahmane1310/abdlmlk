import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { profileQuery } from '@/features/profile/profile.queries'
import { siteSettingsQuery } from '@/features/site/site.queries'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { CONTACT_ID, getContactLinks } from './contact-band'
import { Container } from './container'
import { LanguageSwitcher } from './language-switcher'
import { MobileMenu } from './mobile-menu'
import { NAV_ITEMS } from './nav-items'
import { SiteMark } from './site-mark'
import { ThemeToggle } from './theme-toggle'

/**
 * The site header (DESIGN.md, "Site header"): the mark and name, the pages as
 * centred mono labels with a blue line under the current one, then language,
 * theme and a "Contact" button that jumps to the page's contact band. Below
 * large screens the pages, language and theme move into the menu.
 */
export function SiteHeader() {
  const t = useTranslation()
  const lang = useLanguage()
  const { data: site } = useSuspenseQuery(siteSettingsQuery(lang))
  const { data: profile } = useSuspenseQuery(profileQuery(lang))

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      {/* Three columns on large screens, the outer two equal, so the pages sit
          at the centre of the bar whatever the name's or buttons' width. */}
      <Container className="flex h-16 items-center gap-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link
          to="/$lang"
          params={{ lang }}
          className="flex shrink-0 items-center gap-2.5 justify-self-start font-mono text-sm font-medium tracking-tight"
        >
          <SiteMark name={site.siteName} />
          {site.siteName}
        </Link>

        <nav
          aria-label={t.layout.mainNavigation}
          className="hidden h-full lg:block"
        >
          <ul className="flex h-full items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="h-full">
                {/* Full height, so the current page's line sits on the
                    header's bottom edge, like the project filters'. */}
                <Link
                  to={item.to}
                  params={{ lang }}
                  activeOptions={{ exact: item.exact }}
                  className="relative flex h-full items-center mono-label hover:text-foreground data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:inset-x-0 data-[status=active]:after:-bottom-px data-[status=active]:after:h-0.5 data-[status=active]:after:bg-primary"
                >
                  {t.nav[item.label]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <div className="hidden items-center gap-1 lg:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          {getContactLinks(profile) && (
            <Button asChild size="sm" className="ms-2">
              <a href={`#${CONTACT_ID}`}>{t.contact.label}</a>
            </Button>
          )}
          <MobileMenu />
        </div>
      </Container>
    </header>
  )
}
