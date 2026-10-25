import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getCareer } from './career.functions'

export const careerQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['career', lang],
    queryFn: () => getCareer({ data: { lang } }),
  })
