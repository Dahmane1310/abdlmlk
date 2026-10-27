import { createFileRoute, redirect } from '@tanstack/react-router'

import { newsletterSearchSchema } from '@/features/newsletter/newsletter.schema'
import { getPreferredLanguage } from '@/lib/i18n/language.functions'

// "/" has no content of its own: it sends visitors to their language.
export const Route = createFileRoute('/')({
  // Kept through the redirect: the CMS sends readers here with
  // ?newsletter=invalid when it can't tell their language.
  validateSearch: newsletterSearchSchema,
  beforeLoad: async ({ search }) => {
    const lang = await getPreferredLanguage()
    throw redirect({ to: '/$lang', params: { lang }, search })
  },
})
