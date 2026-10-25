import { useSuspenseQuery } from '@tanstack/react-query'

import { profileQuery } from '@/features/profile/profile.queries'
import { siteSettingsQuery } from '@/features/site/site.queries'
import { LANGUAGES } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { Container } from './container'
import { LanguageLink } from './language-link'

export function SiteFooter() {
  const t = useTranslation()
  const lang = useLanguage()
  const { data: site } = useSuspenseQuery(siteSettingsQuery(lang))
  const { data: profile } = useSuspenseQuery(profileQuery(lang))

  return (
    <footer className="border-t">
      <Container className="flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs">
          © {new Date().getFullYear()} {site.siteName}
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <nav aria-label={t.layout.socialLinks}>
            <ul className="flex gap-4">
              {profile.socials.map((social) => (
                <li key={social.url}>
                  {/* rel="me" marks these as the site owner's own profiles. */}
                  <a
                    href={social.url}
                    rel="me"
                    className="font-mono text-xs hover:text-foreground"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t.layout.languages}>
            <ul className="flex gap-4">
              {LANGUAGES.map((language) => (
                <li key={language}>
                  <LanguageLink
                    language={language}
                    className="hover:text-foreground"
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
