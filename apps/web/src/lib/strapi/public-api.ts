import type { z } from 'zod'

import { publicEnv } from '@/env'

/**
 * Sends data from the browser straight to one of Strapi's public endpoints
 * (ARCHITECTURE.md, "Writing data"), so its per-visitor spam limits see the
 * visitor's IP rather than our server's.
 */
export async function postToStrapi<Schema extends z.ZodType>(
  path: string,
  body: unknown,
  schema: Schema,
) {
  const response = await fetch(
    new URL(`/api${path}`, publicEnv.VITE_STRAPI_URL),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )
  if (!response.ok) {
    throw new Error(`Strapi answered ${String(response.status)} to ${path}`)
  }
  return schema.parse(await response.json())
}
