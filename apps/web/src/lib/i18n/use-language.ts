import { useParams } from '@tanstack/react-router'

import { DEFAULT_LANGUAGE, isLanguage } from './config'
import type { Language } from './config'

/**
 * The language of the current page, for components outside the /$lang routes'
 * own files (root shell, header, footer). Pages without a language prefix,
 * and 404s for unknown prefixes, fall back to the default.
 */
export function useLanguage(): Language {
  const { lang } = useParams({ strict: false })
  return isLanguage(lang) ? lang : DEFAULT_LANGUAGE
}
