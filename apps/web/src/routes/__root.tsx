import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Direction } from 'radix-ui'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { ErrorPage } from '@/components/layout/error-page'
import { NotFoundPage } from '@/components/layout/not-found-page'
import { SiteLayout } from '@/components/layout/site-layout'
import { profileQuery } from '@/features/profile/profile.queries'
import { siteSettingsQuery } from '@/features/site/site.queries'
import { getDirection, getLanguageFromPath } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/use-language'
import { getTheme } from '@/lib/theme/theme'
import { THEME_SCRIPT } from '@/lib/theme/theme-script'

import appCss from '../styles/app.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // The layout (header, footer, <head>) needs CMS data on every page, including
  // 404s that never reach the /$lang route, so it loads here, for the language
  // in the URL. Cached queries make this free after the first visit.
  beforeLoad: async ({ context, location }) => {
    const lang = getLanguageFromPath(location.pathname)
    // 'static': use what's cached, fetch only what's missing.
    const [siteSettings] = await Promise.all([
      context.queryClient.query({
        ...siteSettingsQuery(lang),
        staleTime: 'static',
      }),
      context.queryClient.query({ ...profileQuery(lang), staleTime: 'static' }),
    ])
    return { siteSettings }
  },
  // Read once on load; the theme toggle invalidates the router after a change.
  loader: () => ({ theme: getTheme() }),
  staleTime: Infinity,
  head: ({ match }) => {
    const { siteSettings } = match.context
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: siteSettings.defaultSeo?.metaTitle ?? siteSettings.siteName },
        ...(siteSettings.defaultSeo
          ? [
              {
                name: 'description',
                content: siteSettings.defaultSeo.metaDescription,
              },
            ]
          : []),
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        // Until a favicon is uploaded in the CMS, the bundled default is used.
        { rel: 'icon', href: siteSettings.favicon?.url ?? '/favicon.svg' },
      ],
    }
  },
  shellComponent: RootDocument,
  // Unknown language prefixes, e.g. /de, which never reach the /$lang layout.
  notFoundComponent: RootNotFound,
  errorComponent: ErrorPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const language = useLanguage()
  const direction = getDirection(language)

  return (
    // The theme script sets the `dark` class before React hydrates.
    <html lang={language} dir={direction} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {/* Radix components (menus, sheets) read direction from here, not from <html dir>. */}
        <Direction.Provider dir={direction}>{children}</Direction.Provider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function RootNotFound() {
  return (
    <SiteLayout>
      <NotFoundPage />
    </SiteLayout>
  )
}
