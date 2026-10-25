import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getProfile } from './profile.functions'

export const profileQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['profile', lang],
    queryFn: () => getProfile({ data: { lang } }),
  })
