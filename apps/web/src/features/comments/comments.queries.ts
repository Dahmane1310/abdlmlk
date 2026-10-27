import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getComments } from './comments.functions'

export const commentsQuery = (article: string, lang: Language) =>
  queryOptions({
    queryKey: ['comments', article, lang],
    queryFn: () => getComments({ data: { article, lang } }),
  })
