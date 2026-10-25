export const LANGUAGES = ['en', 'ar', 'fr'] as const;
export type Language = (typeof LANGUAGES)[number];

export const isLanguage = (value: unknown): value is Language =>
  typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmail = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= 254 && EMAIL.test(value.trim());

/** Trims a text field and checks its length. Returns undefined when missing or invalid. */
export function cleanText(value: unknown, { min = 1, max }: { min?: number; max: number }) {
  if (typeof value !== 'string') return undefined;
  const text = value.trim();
  return text.length >= min && text.length <= max ? text : undefined;
}

/** Public URL of the website, used for links in emails and redirects. */
export const siteUrl = () => (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
