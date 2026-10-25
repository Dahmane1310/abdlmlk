import { createClientOnlyFn } from '@tanstack/react-start'

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

/** Reads a cookie in the browser. */
export const readBrowserCookie = createClientOnlyFn((name: string) => {
  const entry = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
  return entry === undefined
    ? undefined
    : decodeURIComponent(entry.slice(name.length + 1))
})

/** Stores a visitor preference in the browser for a year, for the whole site. */
export const writeBrowserCookie = createClientOnlyFn(
  (name: string, value: string) => {
    const secure = location.protocol === 'https:' ? '; secure' : ''
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${String(ONE_YEAR_IN_SECONDS)}; samesite=lax${secure}`
  },
)
