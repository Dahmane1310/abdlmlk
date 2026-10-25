import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getSiteSettings } from './site.functions'

export const siteSettingsQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['site-settings', lang],
    queryFn: () => getSiteSettings({ data: { lang } }),
  })
