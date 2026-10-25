import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getProjects } from './projects.functions'

export const projectsQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['projects', lang],
    queryFn: () => getProjects({ data: { lang } }),
  })
