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
 * A length of time in months, in words: "2 years 5 months", "سنتان و5 أشهر",
 * "8 mois". Long unit names: the short ones are unclear in French ("5 m.").
 */
export function formatDuration(totalMonths: number, language: Language) {
  const locale = INTL_LOCALES[language]
  const unit = (value: number, name: 'year' | 'month') =>
    new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: name,
      unitDisplay: 'long',
    }).format(value)

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const parts = [
    years > 0 ? unit(years, 'year') : null,
    months > 0 ? unit(months, 'month') : null,
  ].filter((part) => part != null)

  return new Intl.ListFormat(locale, { style: 'narrow', type: 'unit' }).format(
    parts,
  )
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

/**
 * Years only, for one-line summaries: "2023 — 2024", "2024" (one year, or an
 * end date only) or "2025 — Present" (no end). Null when neither date is set.
 * The year is the ISO date's first four characters, in Latin digits like
 * every number on the site.
 */
export function formatYearRange(
  start: string | null,
  end: string | null,
  presentLabel: string,
) {
  const from = start?.slice(0, 4)
  const to = end?.slice(0, 4)

  if (!from) return to ?? null
  if (!to) return `${from} — ${presentLabel}`
  return from === to ? from : `${from} — ${to}`
}
