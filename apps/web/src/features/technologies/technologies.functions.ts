import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { languageSchema } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'

import {
  technologyCategorySchema,
  technologyListSchema,
} from './technologies.schema'
import { withIconPath } from './technology-icon.server'

/** All technologies with their logos, grouped by category; empty categories are left out. */
export const getSkills = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .collection('technologies')
      .find({
        locale: data.lang,
        fields: ['name', 'slug', 'icon', 'category'],
        // "order" is set in the CMS to put the main technologies first.
        sort: ['order:asc', 'name:asc'],
        pagination: { pageSize: 100 },
      })
    const technologies = technologyListSchema.parse(response).data

    return technologyCategorySchema.options
      .map((category) => ({
        category,
        technologies: technologies
          .filter((technology) => technology.category === category)
          .map(withIconPath),
      }))
      .filter((group) => group.technologies.length > 0)
  })

export type SkillGroup = Awaited<ReturnType<typeof getSkills>>[number]
