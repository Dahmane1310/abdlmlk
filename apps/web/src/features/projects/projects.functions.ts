import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { languageSchema } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'

import { projectListSchema } from './projects.schema'

export const getProjects = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .collection('projects')
      .find({
        locale: data.lang,
        // "order" is set in the CMS to control how projects are listed.
        sort: ['order:asc', 'title:asc'],
        pagination: { pageSize: 100 },
        populate: {
          cover: true,
          technologies: { fields: ['name', 'slug'] },
          client: { fields: ['name'] },
          organization: { fields: ['name'] },
        },
      })
    return projectListSchema.parse(response).data
  })
