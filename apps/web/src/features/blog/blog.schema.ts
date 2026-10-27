import { z } from 'zod'

import { contentBlockSchema } from '@/lib/content/blocks.schema'
import { mediaSchema, seoSchema } from '@/lib/strapi/schemas'

export const tagSchema = z.object({
  name: z.string(),
  slug: z.string(),
})

const seriesRefSchema = z.object({
  title: z.string(),
  slug: z.string(),
  /** Only on an article's own page: the series' parts, for its parts card. */
  articles: z
    .array(
      z.object({
        title: z.string(),
        slug: z.string(),
        seriesPart: z.number().nullable(),
      }),
    )
    .optional(),
})

/** An article as the CMS sends it: what the list shows, plus its blocks. */
export const articleSchema = z.object({
  /** Shared by the article's languages: likes are counted per document. */
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  cover: mediaSchema.nullable(),
  publishedDate: z.iso.date(),
  updatedDate: z.iso.date().nullable(),
  tags: z.array(tagSchema),
  series: seriesRefSchema.nullable(),
  /** Its place in the series: 1, 2, 3… */
  seriesPart: z.number().nullable(),
  allowComments: z.boolean().nullable(),
  blocks: z.array(contentBlockSchema).nullable(),
  seo: seoSchema.nullable().optional(),
})

export const articleListSchema = z.object({
  data: z.array(articleSchema),
})

/** A series as its own page shows it; its parts come from the article list. */
export const seriesSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
})

export const seriesListSchema = z.object({
  data: z.array(seriesSchema),
})

/** The filter in the URL (?tag=arabic). An unknown tag shows the empty state. */
export const blogSearchSchema = z.object({
  tag: z.string().optional().catch(undefined),
})

export type Tag = z.output<typeof tagSchema>
