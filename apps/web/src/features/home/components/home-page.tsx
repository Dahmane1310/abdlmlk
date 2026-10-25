import { useSuspenseQuery } from '@tanstack/react-query'

import { profileQuery } from '@/features/profile/profile.queries'
import { useLanguage } from '@/lib/i18n/use-language'

import { Hero } from './hero'
import { Highlights } from './highlights'

export function HomePage() {
  const lang = useLanguage()
  const { data: profile } = useSuspenseQuery(profileQuery(lang))

  return (
    <>
      <Hero profile={profile} />
      <Highlights items={profile.highlights} />
    </>
  )
}
