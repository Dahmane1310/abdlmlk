import { queryOptions } from '@tanstack/react-query'

import type { Language } from '@/lib/i18n/config'

import { getProfile, getSpokenLanguages } from './profile.functions'

export const profileQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['profile', lang],
    queryFn: () => getProfile({ data: { lang } }),
  })

export const spokenLanguagesQuery = (lang: Language) =>
  queryOptions({
    queryKey: ['profile', lang, 'spokenLanguages'],
    queryFn: () => getSpokenLanguages({ data: { lang } }),
  })
