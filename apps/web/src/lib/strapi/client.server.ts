import { strapi } from '@strapi/client'

import { getServerEnv } from '@/env.server'

/** Server-only Strapi client. Built per call, so it reads the environment per request. */
export function getStrapiClient() {
  return strapi({ baseURL: new URL('/api', getServerEnv().strapiUrl).href })
}
