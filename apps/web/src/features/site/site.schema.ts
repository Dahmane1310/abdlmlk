import { z } from 'zod'

import { mediaSchema, seoSchema } from '@/lib/strapi/schemas'

/** The "Site settings" single type: site name, default SEO, favicon. */
export const siteSettingsSchema = z.object({
  siteName: z.string(),
  tagline: z.string().nullable(),
  defaultSeo: seoSchema.nullable(),
  favicon: mediaSchema.nullable(),
})
