import {
  createFileRoute,
  notFound,
  Outlet,
  rootRouteId,
} from '@tanstack/react-router'

import { NotFoundPage } from '@/components/layout/not-found-page'
import { SiteLayout } from '@/components/layout/site-layout'
import { isLanguage } from '@/lib/i18n/config'

// Every page lives under a language prefix. Parsing here gives child routes a
// typed `lang` ('en' | 'ar' | 'fr'), and an unknown prefix becomes a 404.
export const Route = createFileRoute('/$lang')({
  params: {
    parse: ({ lang }) => {
      // Handled by the root route: this route's own layout never renders for an invalid language.
      if (!isLanguage(lang)) throw notFound({ routeId: rootRouteId })
      return { lang }
    },
    stringify: ({ lang }) => ({ lang }),
  },
  component: LanguageLayout,
  // Unknown pages under a valid language, e.g. /en/nope.
  notFoundComponent: NotFoundPage,
})

function LanguageLayout() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  )
}
