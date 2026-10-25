import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getSkills } from './technologies.functions'

export const skillsQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['skills', lang],
    queryFn: () => getSkills({ data: { lang } }),
  })
