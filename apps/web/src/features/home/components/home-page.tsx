import { useSuspenseQuery } from '@tanstack/react-query'

import { Page } from '@/components/layout/page'
import { profileQuery } from '@/features/profile/profile.queries'
import { projectsQuery } from '@/features/projects/projects.queries'
import { useLanguage } from '@/lib/i18n/use-language'

import { Hero } from './hero'
import { SelectedWork } from './selected-work'

// The design's layout: one wide card, then a row of three.
const FEATURED_COUNT = 4

export function HomePage() {
  const lang = useLanguage()
  const { data: profile } = useSuspenseQuery(profileQuery(lang))
  // The same list as the projects page, so moving between them is free.
  const { data: projects } = useSuspenseQuery(projectsQuery(lang))
  const featured = projects
    .filter((project) => project.featured)
    .slice(0, FEATURED_COUNT)

  return (
    <Page
      header={<Hero profile={profile} showWorkLink={featured.length > 0} />}
    >
      <SelectedWork projects={featured} />
    </Page>
  )
}
