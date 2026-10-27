import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { languageSchema } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'

import { commentListSchema } from './comments.schema'
import { toThreads } from './threads'

/**
 * An article's approved responses in one language, grouped into threads.
 * Responses belong to the language they were written in.
 */
export const getComments = createServerFn({ method: 'GET' })
  .validator(z.object({ article: z.string(), lang: languageSchema }))
  .handler(async ({ data }) => {
    const query = new URLSearchParams({
      article: data.article,
      locale: data.lang,
    })
    const response = await getStrapiClient().fetch(
      `/comments?${query.toString()}`,
    )
    return toThreads(commentListSchema.parse(await response.json()).data)
  })
