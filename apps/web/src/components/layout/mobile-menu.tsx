import { Link } from '@tanstack/react-router'
import { MenuIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LANGUAGES } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { LanguageLink } from './language-link'
import { NAV_ITEMS } from './nav-items'
import { ThemeToggle } from './theme-toggle'

/**
 * Navigation below large screens, in a panel that slides in from the end
 * side: the pages, then the language and theme that the header only shows
 * on large screens.
 */
export function MobileMenu() {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={t.layout.openMenu}
        >
          <MenuIcon aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent
        closeLabel={t.layout.closeMenu}
        aria-describedby={undefined}
      >
        <SheetHeader>
          {/* The sheet's title is bold by default; here it's a label like the others. */}
          <SheetTitle className="mono-label font-normal text-muted-foreground">
            {t.layout.menu}
          </SheetTitle>
        </SheetHeader>
        <nav aria-label={t.layout.mainNavigation} className="px-4">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <SheetClose asChild>
                  {/* The current page gets a 2px blue line on its start edge,
                      as the header underlines it. */}
                  <Link
                    to={item.to}
                    params={{ lang }}
                    // As in the header: whatever follows "?".
                    activeOptions={{ exact: item.exact, includeSearch: false }}
                    className="block border-s-2 border-transparent px-3 py-3 text-2xl font-semibold tracking-tight text-muted-foreground hover:text-foreground data-[status=active]:border-primary data-[status=active]:text-foreground"
                  >
                    {t.nav[item.label]}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto flex items-center justify-between gap-4 border-t px-7 py-4">
          <nav aria-label={t.layout.languages}>
            <ul className="flex gap-4 text-sm">
              {LANGUAGES.map((language) => (
                <li key={language}>
                  <SheetClose asChild>
                    <LanguageLink
                      language={language}
                      aria-current={language === lang ? 'true' : undefined}
                      className="text-muted-foreground hover:text-foreground aria-[current]:text-foreground aria-[current]:underline aria-[current]:decoration-2 aria-[current]:underline-offset-[6px]"
                    />
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}
