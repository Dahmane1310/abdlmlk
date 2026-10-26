import {
  LayersIcon,
  LayoutDashboardIcon,
  ServerIcon,
  SparklesIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react'

// The Lucide icons a service's "icon" field can name in the CMS. Listed here
// rather than looked up by name, so the browser downloads only these. A new
// icon is one more line; an unknown name shows the service without one.
const ICONS: Partial<Record<string, LucideIcon>> = {
  layers: LayersIcon,
  'layout-dashboard': LayoutDashboardIcon,
  server: ServerIcon,
  sparkles: SparklesIcon,
  users: UsersIcon,
}

/** Decorative: the service's title says what it is. */
export function ServiceIcon({
  name,
  className,
}: {
  name: string | null
  className?: string
}) {
  const Icon = name ? ICONS[name] : undefined

  if (!Icon) return null

  return <Icon aria-hidden strokeWidth={1.75} className={className} />
}
