import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { languageSchema } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'

import { serviceListSchema } from './services.schema'

/** The services marked "featured" in the CMS, in its order. */
export const getServices = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .collection('services')
      .find({
        locale: data.lang,
        fields: ['title', 'slug', 'summary', 'icon'],
        filters: { featured: { $eq: true } },
        sort: ['order:asc', 'title:asc'],
        pagination: { pageSize: 100 },
      })
    return serviceListSchema.parse(response).data
  })
