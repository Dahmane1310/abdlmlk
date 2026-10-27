import { queryOptions } from '@tanstack/react-query'

import { getLikes } from './likes.functions'

export const likesQuery = (article: string) =>
  queryOptions({
    queryKey: ['likes', article],
    queryFn: () => getLikes({ data: { article } }),
  })
