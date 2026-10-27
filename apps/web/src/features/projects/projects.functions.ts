import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { withIconPath } from '@/features/technologies/technology-icon.server'
import { CONTENT_BLOCKS_POPULATE } from '@/lib/content/blocks.schema'
import { renderContentBlocks } from '@/lib/content/blocks.server'
import { languageSchema } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'
import { languagesOf } from '@/lib/strapi/schemas'

import { projectDetailListSchema, projectListSchema } from './projects.schema'

// Relations every project view shows.
const CARD_POPULATE = {
  cover: true,
  technologies: { fields: ['name', 'slug', 'icon'] },
  client: { fields: ['name'] },
  organization: { fields: ['name'] },
}

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
        populate: CARD_POPULATE,
      })
    return projectListSchema.parse(response).data.map((project) => ({
      ...project,
      technologies: project.technologies.map(withIconPath),
    }))
  })

export const getProject = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema, slug: z.string() }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .collection('projects')
      .find({
        locale: data.lang,
        filters: { slug: { $eq: data.slug } },
        populate: {
          ...CARD_POPULATE,
          gallery: true,
          metrics: true,
          seo: { populate: ['shareImage'] },
          content: CONTENT_BLOCKS_POPULATE,
          localizations: { fields: ['locale'] },
        },
      })
    // .at() is typed as possibly undefined, so the 404 check is real to TypeScript.
    const project = projectDetailListSchema.parse(response).data.at(0)
    if (!project) throw notFound()

    return {
      ...project,
      technologies: project.technologies.map(withIconPath),
      gallery: project.gallery ?? [],
      content: await renderContentBlocks(project.content ?? []),
      languages: languagesOf(data.lang, project.localizations),
    }
  })

/** A project as the list and cards show it, technologies with their logos. */
export type ProjectSummary = Awaited<ReturnType<typeof getProjects>>[number]
