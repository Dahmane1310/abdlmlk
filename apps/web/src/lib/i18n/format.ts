import type { Language } from './config'

// Arabic uses Latin digits to match the CMS content ("19/20", "15–25%").
const INTL_LOCALES: Record<Language, string> = {
  en: 'en',
  ar: 'ar-u-nu-latn',
  fr: 'fr',
}

/**
 * "Apr 2023" in English, "avr. 2023" in French. CMS dates are plain days
 * ("2023-04-01"), parsed as UTC midnight; formatting in UTC keeps them from
 * shifting to the previous month in time zones behind UTC.
 */
export function formatMonthYear(isoDate: string, language: Language) {
  return new Intl.DateTimeFormat(INTL_LOCALES[language], {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(isoDate))
}

/**
 * "Apr 2023 — Aug 2024", "Jun 2024 — Present" (no end) or "Jun 2024" (end only).
 * Null when neither date is set.
 */
export function formatDateRange(
  start: string | null,
  end: string | null,
  language: Language,
  presentLabel: string,
) {
  if (start) {
    const to = end ? formatMonthYear(end, language) : presentLabel
    return `${formatMonthYear(start, language)} — ${to}`
  }
  return end ? formatMonthYear(end, language) : null
}
