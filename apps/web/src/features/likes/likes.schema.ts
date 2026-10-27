import { z } from 'zod'

/** GET /api/likes: how many visitors like an article, its languages counted together. */
export const likeTotalSchema = z.object({
  data: z.object({ total: z.number() }),
})

/** POST /api/likes: the new total, and the visitor's like as the CMS saved it. */
export const likeResultSchema = z.object({
  data: z.object({ total: z.number(), liked: z.boolean() }),
})
