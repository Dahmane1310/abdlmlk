import type { ArticleComment } from './comments.schema'

/** A response to the article, with every reply under it in date order. */
export interface CommentThread {
  comment: ArticleComment
  replies: ArticleComment[]
}

/**
 * Groups responses into threads one level deep: a reply to a reply joins its
 * response's thread. Expects them oldest first, as the CMS sends them, so a
 * parent always comes before its replies. A reply whose response isn't shown
 * (since rejected) is left out: it would answer nothing on the page.
 */
export function toThreads(comments: ArticleComment[]) {
  const threads: CommentThread[] = []
  const threadOf = new Map<string, CommentThread>()

  for (const comment of comments) {
    if (comment.parent === null) {
      const thread: CommentThread = { comment, replies: [] }
      threads.push(thread)
      threadOf.set(comment.documentId, thread)
      continue
    }
    const thread = threadOf.get(comment.parent)
    if (thread) {
      thread.replies.push(comment)
      threadOf.set(comment.documentId, thread)
    }
  }

  return threads
}

/** Every response and reply shown. */
export const countComments = (threads: CommentThread[]) =>
  threads.reduce((sum, thread) => sum + 1 + thread.replies.length, 0)
