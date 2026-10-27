import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { getStrapiClient } from '@/lib/strapi/client.server'

import { likeTotalSchema } from './likes.schema'

/** An article's likes, by its document id (the same in every language). */
export const getLikes = createServerFn({ method: 'GET' })
  .validator(z.object({ article: z.string() }))
  .handler(async ({ data }) => {
    const query = new URLSearchParams({ article: data.article })
    const response = await getStrapiClient().fetch(`/likes?${query.toString()}`)
    return likeTotalSchema.parse(await response.json()).data.total
  })
