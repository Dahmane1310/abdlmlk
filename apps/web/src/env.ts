import { z } from 'zod'

/**
 * Public settings, validated once when the app loads. Vite inlines `VITE_`
 * variables into the browser bundle at build time: nothing secret belongs here,
 * and changing one needs a rebuild.
 */
export const publicEnv = z
  .object({
    /** Strapi's public URL, for images and form posts from the browser. */
    VITE_STRAPI_URL: z.url(),
  })
  .parse({
    VITE_STRAPI_URL: import.meta.env.VITE_STRAPI_URL,
  })
