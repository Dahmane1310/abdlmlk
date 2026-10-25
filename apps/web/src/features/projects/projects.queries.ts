import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getProject, getProjects } from './projects.functions'

export const projectsQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['projects', lang],
    queryFn: () => getProjects({ data: { lang } }),
  })

export const projectQuery = (lang: Language, slug: string) =>
  queryOptions({
    queryKey: ['projects', lang, slug],
    queryFn: () => getProject({ data: { lang, slug } }),
  })
