import { z } from 'zod'

import { publicEnv } from './env'

// Treats `STRAPI_URL=` (present but empty) the same as unset.
const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.url().optional(),
)

const serverEnvSchema = z.object({
  /** How the server reaches Strapi: in production, its internal Docker address. */
  STRAPI_URL: optionalUrl,
})

/** Server-only settings. Read per request, never at module level. */
export function getServerEnv() {
  const env = serverEnvSchema.parse({ STRAPI_URL: process.env.STRAPI_URL })
  return {
    strapiUrl: env.STRAPI_URL ?? publicEnv.VITE_STRAPI_URL,
  }
}
