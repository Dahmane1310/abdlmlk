import type { Element, ElementContent, Root } from 'hast'

export interface Heading {
  id: string
  text: string
}

const textOf = (node: ElementContent): string => {
  if (node.type === 'text') return node.value
  if (node.type === 'element') return node.children.map(textOf).join('')
  return ''
}

/** "Do the work once, on the server" → "do-the-work-once-on-the-server". Arabic letters stay. */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')

/**
 * Gives every h2 and h3 an id made from its text, so a table of contents (or
 * anyone) can link to it, and returns the h2s in order. `used` holds the ids
 * already taken on the page and is shared by all of an article's blocks; a
 * repeated id gets a number ("setup-2").
 */
export function addHeadingIds(tree: Root, used: Set<string>): Heading[] {
  const headings: Heading[] = []

  const visit = (parent: Root | Element) => {
    for (const node of parent.children) {
      if (node.type !== 'element') continue
      if (node.tagName !== 'h2' && node.tagName !== 'h3') {
        visit(node)
        continue
      }
      const text = node.children.map(textOf).join('').trim()
      const base = slugify(text) || 'section'
      let id = base
      for (let count = 2; used.has(id); count++) id = `${base}-${String(count)}`
      used.add(id)
      node.properties.id = id
      if (node.tagName === 'h2') headings.push({ id, text })
    }
  }

  visit(tree)
  return headings
}
