import type { ContentBlockInput } from '@/lib/content/blocks.schema'

// A common average for reading on screen; code is counted like prose.
const WORDS_PER_MINUTE = 230

const countWords = (text: string | null) =>
  text?.split(/\s+/).filter(Boolean).length ?? 0

/** Minutes to read an article's blocks, rounded, at least 1. Images don't count. */
export function readingMinutes(blocks: ContentBlockInput[]) {
  const words = blocks.reduce((total, block) => {
    switch (block.__component) {
      case 'shared.rich-text':
        return total + countWords(block.body)
      case 'shared.quote':
        return total + countWords(block.body)
      case 'shared.code':
        return total + countWords(block.code)
      case 'shared.callout':
        return total + countWords(block.title) + countWords(block.body)
      case 'shared.media':
      case 'shared.slider':
        return total
    }
  }, 0)

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
