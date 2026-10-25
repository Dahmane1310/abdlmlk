import { createFileRoute, redirect } from '@tanstack/react-router'

import { getPreferredLanguage } from '@/lib/i18n/language.functions'

// "/" has no content of its own: it sends visitors to their language.
export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const lang = await getPreferredLanguage()
    throw redirect({ to: '/$lang', params: { lang } })
  },
})
