import { useLoaderData, useRouter } from '@tanstack/react-router'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/use-translation'
import type { Theme } from '@/lib/theme/config'
import { saveTheme } from '@/lib/theme/theme'

const NEXT_THEME: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
}

const THEME_ICON: Record<Theme, LucideIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
}

/** Cycles light → dark → system. The icon shows the current theme; the label says what a click does. */
export function ThemeToggle() {
  const t = useTranslation()
  const router = useRouter()
  const { theme } = useLoaderData({ from: '__root__' })

  const next = NEXT_THEME[theme]
  const Icon = THEME_ICON[theme]
  const label = t.theme.switchTo[next]

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => {
        saveTheme(next)
        // Re-reads the theme in the root loader so this button updates.
        void router.invalidate()
      }}
    >
      <Icon aria-hidden />
    </Button>
  )
}
