import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getArticle, getArticles } from './blog.functions'

export const articlesQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['articles', lang],
    queryFn: () => getArticles({ data: { lang } }),
  })

export const articleQuery = (lang: Language, slug: string) =>
  queryOptions({
    queryKey: ['articles', lang, slug],
    queryFn: () => getArticle({ data: { lang, slug } }),
  })
