import { createClientOnlyFn, createIsomorphicFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

import { readBrowserCookie, writeBrowserCookie } from '@/lib/cookies'

import { DEFAULT_THEME, THEME_COOKIE, themeSchema } from './config'
import type { Theme } from './config'

// The cookie is read on the server while rendering, and in the browser after
// a change, so switching theme needs no network request.
const readThemeCookie = createIsomorphicFn()
  .server(() => getCookie(THEME_COOKIE))
  .client(() => readBrowserCookie(THEME_COOKIE))

export function getTheme(): Theme {
  const parsed = themeSchema.safeParse(readThemeCookie())
  return parsed.success ? parsed.data : DEFAULT_THEME
}

/** Saves the choice and applies it at once. Mirrors the logic in THEME_SCRIPT. */
export const saveTheme = createClientOnlyFn((theme: Theme) => {
  writeBrowserCookie(THEME_COOKIE, theme)

  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle(
    'dark',
    theme === 'dark' || (theme === 'system' && prefersDark),
  )
})
