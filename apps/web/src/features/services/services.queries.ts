import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getServices } from './services.functions'

export const servicesQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['services', lang],
    queryFn: () => getServices({ data: { lang } }),
  })
