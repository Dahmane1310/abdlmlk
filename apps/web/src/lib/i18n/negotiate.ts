import { DEFAULT_LANGUAGE, isLanguage } from './config'
import type { Language } from './config'

/**
 * Picks the best supported language from an Accept-Language header,
 * e.g. "ar-DZ,ar;q=0.9,fr;q=0.8,en;q=0.7" gives "ar".
 */
export function negotiateLanguage(header: string | undefined): Language {
  if (!header) return DEFAULT_LANGUAGE

  const ranked = header
    .split(',')
    .map((entry) => {
      const [tag = '', ...params] = entry.trim().split(';')
      const qualityParam = params.find((param) => param.trim().startsWith('q='))
      return {
        language: tag.split('-')[0]?.toLowerCase(),
        quality: qualityParam ? Number(qualityParam.trim().slice(2)) : 1,
      }
    })
    // q=0 means "not acceptable"; a malformed q is ignored.
    .filter(({ quality }) => quality > 0)
    // Stable sort: equal qualities keep the order the browser sent them in.
    .sort((a, b) => b.quality - a.quality)

  return (
    ranked.map(({ language }) => language).find(isLanguage) ?? DEFAULT_LANGUAGE
  )
}
