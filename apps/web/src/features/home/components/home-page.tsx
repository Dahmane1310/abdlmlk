import { useSuspenseQuery } from '@tanstack/react-query'

import { Page } from '@/components/layout/page'
import { profileQuery } from '@/features/profile/profile.queries'
import { useLanguage } from '@/lib/i18n/use-language'

import { Hero } from './hero'

export function HomePage() {
  const lang = useLanguage()
  const { data: profile } = useSuspenseQuery(profileQuery(lang))

  // The sections from the design (selected work, what I do, experience)
  // come in the next step; the contact band closes the page meanwhile.
  return <Page header={<Hero profile={profile} />} />
}
