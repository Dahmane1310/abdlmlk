import { useSuspenseQuery } from '@tanstack/react-query'

import { Container } from '@/components/layout/container'
import { careerQuery } from '@/features/career/career.queries'
import { EducationList } from '@/features/career/components/education-list'
import { ExperienceList } from '@/features/career/components/experience-list'
import { SpokenLanguages } from '@/features/profile/components/spoken-languages'
import {
  profileDetailsQuery,
  profileQuery,
} from '@/features/profile/profile.queries'
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

  // Empty sections are skipped; the rest are numbered in order.
  const sections = [
    career.experience.length > 0
      ? {
          id: 'experience',
          title: t.about.experience,
          content: <ExperienceList jobs={career.experience} />,
        }
      : null,
    career.education.length > 0
      ? {
          id: 'education',
          title: t.about.education,
          content: <EducationList degrees={career.education} />,
        }
      : null,
    details.spokenLanguages.length > 0
      ? {
          id: 'languages',
          title: t.about.spokenLanguages,
          content: <SpokenLanguages languages={details.spokenLanguages} />,
        }
      : null,
  ].filter((section) => section != null)

  return (
    <Container className="flex flex-col gap-20 py-12 md:gap-24 md:py-16">
      <AboutIntro
        profile={profile}
        details={details}
        experience={career.experience}
      />

      {sections.map((section, index) => (
        <section key={section.id} aria-labelledby={`${section.id}-title`}>
          <h2
            id={`${section.id}-title`}
            className="mb-10 flex items-center gap-4 text-2xl font-semibold tracking-tight"
          >
            {/* "01", "02"…: decoration, so screen readers just hear the title. */}
            <span aria-hidden className="font-mono text-sm text-primary">
              {String(index + 1).padStart(2, '0')}
            </span>
            {section.title}
            <span aria-hidden className="h-px flex-1 bg-border" />
          </h2>
          {section.content}
        </section>
      ))}
    </Container>
  )
}
