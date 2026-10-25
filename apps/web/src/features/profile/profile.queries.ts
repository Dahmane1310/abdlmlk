import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getProfile, getProfileDetails } from './profile.functions'

export const profileQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['profile', lang],
    queryFn: () => getProfile({ data: { lang } }),
  })

export const profileDetailsQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['profile', lang, 'details'],
    queryFn: () => getProfileDetails({ data: { lang } }),
  })
