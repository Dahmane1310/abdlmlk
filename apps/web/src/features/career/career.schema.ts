import { z } from 'zod'

import { mediaSchema } from '@/lib/strapi/schemas'

export const employmentTypeSchema = z.enum([
  'full_time',
  'part_time',
  'freelance',
  'contract',
  'internship',
  'co_founder',
])

export const workModeSchema = z.enum(['remote', 'onsite', 'hybrid'])

const organizationSchema = z.object({
  name: z.string(),
  website: z.url().nullable(),
  logo: mediaSchema.nullable(),
})

/** A job in the "Experience" collection. */
const experienceSchema = z.object({
  documentId: z.string(),
  role: z.string(),
  organization: organizationSchema.nullable(),
  employmentType: employmentTypeSchema.nullable(),
  workMode: workModeSchema.nullable(),
  location: z.string().nullable(),
  startDate: z.iso.date(),
  endDate: z.iso.date().nullable(),
  summary: z.string().nullable(),
  /** Markdown. */
  achievements: z.string().nullable(),
  technologies: z.array(z.object({ name: z.string(), slug: z.string() })),
})

/** A degree in the "Education" collection. */
const educationSchema = z.object({
  documentId: z.string(),
  degree: z.string(),
  field: z.string().nullable(),
  organization: organizationSchema.nullable(),
  location: z.string().nullable(),
  startDate: z.iso.date().nullable(),
  endDate: z.iso.date().nullable(),
  /** Markdown. */
  description: z.string().nullable(),
})

export const experienceListSchema = z.object({
  data: z.array(experienceSchema),
})

export const educationListSchema = z.object({
  data: z.array(educationSchema),
})

export type Organization = z.output<typeof organizationSchema>
