import { z } from 'zod'

import type { Dictionary } from '@/lib/i18n/dictionaries/en'

const commentSchema = z.object({
  documentId: z.string(),
  authorName: z.string(),
  /** Plain text, shown as written: never HTML or Markdown. */
  body: z.string(),
  /** The site owner's own reply, written in the CMS. */
  isAuthorReply: z.boolean().nullable(),
  createdAt: z.iso.datetime(),
  /** The response this one answers, or null when it answers the article. */
  parent: z.string().nullable(),
})

/** GET /api/comments: an article's approved responses, oldest first. */
export const commentListSchema = z.object({
  data: z.array(commentSchema),
})

export type ArticleComment = z.output<typeof commentSchema>

/**
 * The response form, with the CMS's own limits and the page's language for
 * the messages. Only for instant feedback: the CMS checks everything again.
 */
export const commentFormSchema = (errors: Dictionary['comments']['errors']) =>
  z.object({
    authorName: z
      .string()
      .trim()
      .min(2, { error: errors.name })
      .max(80, { error: errors.name }),
    authorEmail: z
      .email({ error: errors.email })
      .max(254, { error: errors.email }),
    body: z
      .string()
      .trim()
      .min(2, { error: errors.response })
      .max(4000, { error: errors.response }),
    // The honeypot: people never see it, bots fill it in.
    website: z.string(),
  })

export type CommentFormValues = z.input<ReturnType<typeof commentFormSchema>>

/** POST /api/comments: saved, and waiting for approval. */
export const commentSentSchema = z.object({
  data: z.object({ ok: z.literal(true) }),
})
