import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
import { z } from 'zod'

import { getServerEnv } from '@/env.server'
import { languageSchema } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'
import { singleResponse } from '@/lib/strapi/schemas'

import { siteSettingsSchema } from './site.schema'

export const getSiteSettings = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .single('site-setting')
      .find({
        locale: data.lang,
        populate: { defaultSeo: { populate: ['shareImage'] }, favicon: true },
      })
    return singleResponse(siteSettingsSchema).parse(response).data
  })

/**
 * The site's public address, without a trailing slash, for canonical links
 * and link previews: SITE_URL, or the address this request came in on
 * (through the proxy's forwarded host and protocol, when there is one).
 */
export const getSiteUrl = createServerFn({ method: 'GET' }).handler(
  () =>
    getServerEnv().siteUrl ?? getRequestUrl({ xForwardedHost: true }).origin,
)
