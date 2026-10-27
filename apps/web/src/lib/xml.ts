const XML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

/** Text going into XML (the RSS feeds, the sitemap) as text, never as markup. */
export const escapeXml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => XML_ENTITIES[char] ?? char)
