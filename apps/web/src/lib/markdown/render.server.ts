import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { createHighlighter } from 'shiki'
import { unified } from 'unified'

// The languages the CMS code block offers, plus a few common in Markdown fences.
const LANGUAGES = [
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'php',
  'python',
  'java',
  'bash',
  'json',
  'yaml',
  'sql',
  'html',
  'css',
  'dockerfile',
  'nginx',
  'diff',
  'markdown',
]

// Light and dark colours both go into the HTML as CSS variables; app.css picks
// one from the site theme, so highlighted code switches theme with no re-render.
const SHIKI_OPTIONS = {
  themes: { light: 'github-light', dark: 'github-dark' },
  defaultColor: false,
} as const

type Highlighter = Awaited<ReturnType<typeof createHighlighter>>

function createMarkdownProcessor(highlighter: Highlighter) {
  return (
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      // Raw HTML in the Markdown is dropped, not passed through.
      .use(remarkRehype)
      // Defence in depth: strips unsafe URLs (javascript:…) and attributes.
      .use(rehypeSanitize)
      // After sanitizing, which would otherwise strip Shiki's colours.
      .use(rehypeShikiFromHighlighter, highlighter, {
        ...SHIKI_OPTIONS,
        defaultLanguage: 'text',
        fallbackLanguage: 'text',
      })
      .use(rehypeStringify)
  )
}

// Loading grammars is slow, so the highlighter and processor are created once per server.
let highlighter: Promise<Highlighter> | undefined
let markdownProcessor:
  Promise<ReturnType<typeof createMarkdownProcessor>> | undefined

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: Object.values(SHIKI_OPTIONS.themes),
    langs: LANGUAGES,
  })
  return highlighter
}

/** Highlighted HTML for a code snippet. Unknown languages render as plain text. */
export async function highlightCode(code: string, language: string) {
  const instance = await getHighlighter()
  return instance.codeToHtml(code, {
    ...SHIKI_OPTIONS,
    lang: instance.getLoadedLanguages().includes(language) ? language : 'text',
  })
}

/** Markdown from the CMS to safe HTML, with highlighted code blocks. */
export async function renderMarkdown(markdown: string) {
  markdownProcessor ??= getHighlighter().then(createMarkdownProcessor)
  return String(await (await markdownProcessor).process(markdown))
}
