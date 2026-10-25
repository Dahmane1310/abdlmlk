import * as simpleIcons from 'simple-icons'

// Every Simple Icons logo's SVG path, by slug. Built on first use, once per server.
let pathsBySlug: Map<string, string> | undefined

function iconPath(slug: string) {
  pathsBySlug ??= new Map(
    Object.values(simpleIcons).map((icon) => [icon.slug, icon.path]),
  )
  return pathsBySlug.get(slug) ?? null
}

/**
 * Swaps a technology's Simple Icons slug for the logo's SVG path (24×24
 * viewBox), so the browser gets the shape and never the icon library.
 * Unknown or missing slugs give no logo.
 */
export function withIconPath<T extends { icon: string | null }>({
  icon,
  ...technology
}: T) {
  return { ...technology, iconPath: icon ? iconPath(icon) : null }
}
