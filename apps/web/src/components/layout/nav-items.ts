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
  { to: '/$lang/about', label: 'about', exact: true },
  // Not exact: stays active on project pages under /projects.
  { to: '/$lang/projects', label: 'projects', exact: false },
  // Not exact either: stays active on articles under /blog.
  { to: '/$lang/blog', label: 'blog', exact: false },
] as const satisfies readonly NavItem[]
