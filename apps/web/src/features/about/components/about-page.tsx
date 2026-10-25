import { useSuspenseQuery } from '@tanstack/react-query'

import { Page } from '@/components/layout/page'
import { PageSection } from '@/components/layout/page-section'
import { careerQuery } from '@/features/career/career.queries'
import { EducationList } from '@/features/career/components/education-list'
import { ExperienceList } from '@/features/career/components/experience-list'
import { SpokenLanguages } from '@/features/profile/components/spoken-languages'
import {
  profileDetailsQuery,
  profileQuery,
} from '@/features/profile/profile.queries'
import { SkillsGrid } from '@/features/technologies/components/skills-grid'
import { skillsQuery } from '@/features/technologies/technologies.queries'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { AboutIntro } from './about-intro'

export function AboutPage() {
  const t = useTranslation()
  const lang = useLanguage()
  // Loaded for the layout on every page, so already cached.
  const { data: profile } = useSuspenseQuery(profileQuery(lang))
  const { data: details } = useSuspenseQuery(profileDetailsQuery(lang))
  const { data: career } = useSuspenseQuery(careerQuery(lang))
  const { data: skills } = useSuspenseQuery(skillsQuery(lang))

  return (
    <Page>
      <AboutIntro
        profile={profile}
        details={details}
        experience={career.experience}
      />

      {career.experience.length > 0 && (
        <PageSection id="experience" title={t.about.experience}>
          <ExperienceList jobs={career.experience} />
        </PageSection>
      )}

      {skills.length > 0 && (
        <PageSection id="skills" title={t.about.skills}>
          <SkillsGrid groups={skills} />
        </PageSection>
      )}

      {career.education.length > 0 && (
        <PageSection id="education" title={t.about.education}>
          <EducationList degrees={career.education} />
        </PageSection>
      )}

      {details.spokenLanguages.length > 0 && (
        <PageSection id="languages" title={t.about.spokenLanguages}>
          <SpokenLanguages languages={details.spokenLanguages} />
        </PageSection>
      )}
    </Page>
  )
}
