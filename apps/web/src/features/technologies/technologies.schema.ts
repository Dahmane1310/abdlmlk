import { z } from 'zod'

/** Technology categories, in the order the Skills section lists them. */
export const technologyCategorySchema = z.enum([
  'language',
  'frontend',
  'backend',
  'mobile',
  'ai',
  'database',
  'devops',
  'tool',
])

/** A technology as projects and jobs link to it: enough for a chip. */
export const technologyRefSchema = z.object({
  name: z.string(),
  slug: z.string(),
  /** Simple Icons slug ("nodedotjs"), turned into the logo on the server. */
  icon: z.string().nullable(),
})

const technologySchema = technologyRefSchema.extend({
  category: technologyCategorySchema,
})

export const technologyListSchema = z.object({
  data: z.array(technologySchema),
})

export type TechnologyCategory = z.output<typeof technologyCategorySchema>
