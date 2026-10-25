import { z } from 'zod'

import { resolveMediaUrl } from './media'

/** An uploaded file, reduced to what the UI needs, with an absolute URL. */
export const mediaSchema = z
  .object({
    url: z.string(),
    alternativeText: z.string().nullable(),
    width: z.number().nullable(),
    height: z.number().nullable(),
  })
  .transform((media) => ({ ...media, url: resolveMediaUrl(media.url) }))

export const seoSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  shareImage: mediaSchema.nullable(),
})

/** Strapi wraps every single type and single document in `{ data: … }`. */
export function singleResponse<T extends z.ZodType>(schema: T) {
  return z.object({ data: schema })
}
