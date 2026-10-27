import { z } from 'zod'

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
