import type { Dictionary } from '@/lib/i18n/dictionaries/en'

interface NavItem {
  to: string
  label: keyof Dictionary['nav']
  exact?: boolean
}

/**
 * Main navigation, shared by the header and the mobile menu. Add a page once
 * its route exists: links are typed, so a missing route won't compile.
 */
export const NAV_ITEMS = [
  { to: '/$lang', label: 'home', exact: true },
] as const satisfies readonly NavItem[]
