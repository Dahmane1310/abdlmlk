import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

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
