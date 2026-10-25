import { z } from 'zod'

import { mediaSchema } from '@/lib/strapi/schemas'

export const projectTypeSchema = z.enum([
  'client',
  'product',
  'personal',
  'academic',
])

const technologySchema = z.object({ name: z.string(), slug: z.string() })

const organizationSchema = z.object({ name: z.string() })

/** A project as listed on the projects page: everything a card shows. */
export const projectSummarySchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  role: z.string().nullable(),
  projectType: projectTypeSchema,
  startDate: z.iso.date().nullable(),
  endDate: z.iso.date().nullable(),
  liveUrl: z.url().nullable(),
  repoUrl: z.url().nullable(),
  cover: mediaSchema.nullable(),
  /** Who the project was for. */
  client: organizationSchema.nullable(),
  /** Where it was built: the company or university. */
  organization: organizationSchema.nullable(),
  technologies: z.array(technologySchema),
})

export const projectListSchema = z.object({
  data: z.array(projectSummarySchema),
})

export type ProjectSummary = z.output<typeof projectSummarySchema>
export type ProjectType = z.output<typeof projectTypeSchema>

/** Filters in the URL (?type=client&tech=laravel). Invalid values are ignored, not errors. */
export const projectsSearchSchema = z.object({
  type: projectTypeSchema.optional().catch(undefined),
  tech: z.string().optional().catch(undefined),
})

export type ProjectsSearch = z.output<typeof projectsSearchSchema>
