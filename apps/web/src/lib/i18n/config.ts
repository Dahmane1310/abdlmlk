import { z } from 'zod'

export const LANGUAGES = ['en', 'ar', 'fr'] as const

export const languageSchema = z.enum(LANGUAGES)

export type Language = z.infer<typeof languageSchema>

export const DEFAULT_LANGUAGE: Language = 'en'

/** Each language's name in itself, so visitors can find theirs whatever the page language. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
}

/** Remembers the visitor's last chosen language, so "/" can send them back to it. */
export const LANGUAGE_COOKIE = 'lang'

export function isLanguage(value: unknown): value is Language {
  return languageSchema.safeParse(value).success
}

/** The language in a path's first segment ("/ar/projects" gives "ar"), else the default. */
export function getLanguageFromPath(pathname: string): Language {
  const firstSegment = pathname.split('/')[1]
  return isLanguage(firstSegment) ? firstSegment : DEFAULT_LANGUAGE
}

export function getDirection(language: Language) {
  return language === 'ar' ? 'rtl' : 'ltr'
}
