import {
  highlightCode,
  renderMarkdown,
  renderMarkdownWithHeadings,
} from '@/lib/markdown/render.server'

import type { ContentBlockInput } from './blocks.schema'

/**
 * Turns CMS blocks into ready-to-display data on the server: Markdown becomes
 * safe HTML and code becomes highlighted HTML, so the browser never downloads
 * a Markdown parser or a highlighter. Empty blocks are dropped. With
 * `headingIds` (the ids already taken on the page), headings get ids and each
 * text block lists its h2s, for an article's table of contents.
 */
export async function renderContentBlocks(
  blocks: ContentBlockInput[],
  { headingIds }: { headingIds?: Set<string> } = {},
) {
  const rendered = await Promise.all(
    blocks.map(async (block) => {
      const key = `${block.__component}-${String(block.id)}`
      switch (block.__component) {
        case 'shared.rich-text':
          return block.body
            ? ({
                type: 'rich-text',
                key,
                ...(await renderMarkdownWithHeadings(block.body, headingIds)),
              } as const)
            : null
        case 'shared.quote':
          return block.body
            ? ({
                type: 'quote',
                key,
                text: block.body,
                cite: block.title,
              } as const)
            : null
        case 'shared.media':
          return block.file
            ? ({ type: 'media', key, image: block.file } as const)
            : null
        case 'shared.slider':
          return block.files?.length
            ? ({ type: 'gallery', key, images: block.files } as const)
            : null
        case 'shared.code':
          return {
            type: 'code',
            key,
            filename: block.filename,
            html: await highlightCode(block.code, block.language),
            // The plain text, for the copy button.
            code: block.code,
          } as const
        case 'shared.callout':
          return {
            type: 'callout',
            key,
            variant: block.variant,
            title: block.title,
            html: await renderMarkdown(block.body),
          } as const
      }
    }),
  )
  return rendered.filter((block) => block !== null)
}

export type ContentBlock = Awaited<
  ReturnType<typeof renderContentBlocks>
>[number]
