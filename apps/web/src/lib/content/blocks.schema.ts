import { z } from 'zod'

import { mediaSchema } from '@/lib/strapi/schemas'

// The CMS's content blocks (a Strapi "dynamic zone"), shared by projects and blog posts.

const richTextBlock = z.object({
  __component: z.literal('shared.rich-text'),
  id: z.number(),
  body: z.string().nullable(),
})

const quoteBlock = z.object({
  __component: z.literal('shared.quote'),
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
})

const mediaBlock = z.object({
  __component: z.literal('shared.media'),
  id: z.number(),
  file: mediaSchema.nullable(),
})

const sliderBlock = z.object({
  __component: z.literal('shared.slider'),
  id: z.number(),
  files: z.array(mediaSchema).nullable(),
})

const codeBlock = z.object({
  __component: z.literal('shared.code'),
  id: z.number(),
  filename: z.string().nullable(),
  language: z.string(),
  code: z.string(),
})

const calloutBlock = z.object({
  __component: z.literal('shared.callout'),
  id: z.number(),
  variant: z.enum(['note', 'tip', 'warning', 'danger']),
  title: z.string().nullable(),
  body: z.string(),
})

export const contentBlockSchema = z.discriminatedUnion('__component', [
  richTextBlock,
  quoteBlock,
  mediaBlock,
  sliderBlock,
  codeBlock,
  calloutBlock,
])

export type ContentBlockInput = z.output<typeof contentBlockSchema>

/** Strapi `populate` for a content-block field: each block type's own files. */
export const CONTENT_BLOCKS_POPULATE = {
  on: {
    'shared.rich-text': true,
    'shared.quote': true,
    'shared.code': true,
    'shared.callout': true,
    'shared.media': { populate: ['file'] },
    'shared.slider': { populate: ['files'] },
  },
}
