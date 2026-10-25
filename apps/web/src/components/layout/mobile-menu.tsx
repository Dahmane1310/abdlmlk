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
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { NAV_ITEMS } from './nav-items'

/** Navigation for small screens, in a panel that slides in from the end side. */
export function MobileMenu() {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
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
          <SheetTitle>{t.layout.menu}</SheetTitle>
        </SheetHeader>
        <nav aria-label={t.layout.mainNavigation} className="px-4">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <SheetClose asChild>
                  <Link
                    to={item.to}
                    params={{ lang }}
                    activeOptions={{ exact: item.exact }}
                    className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[status=active]:text-foreground"
                  >
                    {t.nav[item.label]}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
