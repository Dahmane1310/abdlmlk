import { z } from 'zod'

import { type Language, languageSchema } from '@/lib/i18n/config'

import { resolveMediaUrl } from './media'

// A resized copy Strapi generates for uploaded images (thumbnail, small, medium, large).
const imageFormatSchema = z.object({
  url: z.string(),
  width: z.number(),
})

/** Every available width, smallest first, as an `srcset` value, so browsers download only what they need. */
function buildSrcSet(candidates: { url: string; width: number | null }[]) {
  const sized = candidates.filter(
    (candidate): candidate is { url: string; width: number } =>
      candidate.width !== null,
  )
  if (sized.length === 0) return undefined
  return sized
    .sort((a, b) => a.width - b.width)
    .map(({ url, width }) => `${resolveMediaUrl(url)} ${String(width)}w`)
    .join(', ')
}

/** An uploaded file, reduced to what the UI needs, with absolute URLs. */
export const mediaSchema = z
  .object({
    url: z.string(),
    alternativeText: z.string().nullable(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    // Images only; null for other files (e.g. a PDF).
    formats: z.record(z.string(), imageFormatSchema).nullable().optional(),
  })
  .transform(({ formats, ...media }) => ({
    ...media,
    url: resolveMediaUrl(media.url),
    srcSet: buildSrcSet([...Object.values(formats ?? {}), media]),
  }))

export type Media = z.output<typeof mediaSchema>

/**
 * An entry's other languages (Strapi's `localizations`), so a page links only
 * to translations that exist.
 */
export const localizationsSchema = z.array(z.object({ locale: languageSchema }))

/** The entry's own language and the ones it's translated into. */
export const languagesOf = (
  lang: Language,
  localizations: z.output<typeof localizationsSchema> = [],
) => [lang, ...localizations.map(({ locale }) => locale)]

export const seoSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  shareImage: mediaSchema.nullable(),
})

/** Strapi wraps every single type and single document in `{ data: … }`. */
export function singleResponse<T extends z.ZodType>(schema: T) {
  return z.object({ data: schema })
}
