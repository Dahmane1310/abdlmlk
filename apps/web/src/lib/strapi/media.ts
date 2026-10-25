import { publicEnv } from '@/env'

/**
 * Strapi stores local uploads with relative URLs ("/uploads/…"); browsers need
 * the full address. Absolute URLs (e.g. from cloud storage) pass through unchanged.
 */
export function resolveMediaUrl(url: string) {
  return new URL(url, publicEnv.VITE_STRAPI_URL).href
}
