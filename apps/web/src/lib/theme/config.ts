import { z } from 'zod'

export const THEMES = ['light', 'dark', 'system'] as const

export const themeSchema = z.enum(THEMES)

export type Theme = z.infer<typeof themeSchema>

/** Follow the visitor's operating system until they choose otherwise. */
export const DEFAULT_THEME: Theme = 'system'

export const THEME_COOKIE = 'theme'
