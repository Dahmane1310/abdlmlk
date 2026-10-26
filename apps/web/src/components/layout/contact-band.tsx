import { useSuspenseQuery } from '@tanstack/react-query'
import { ArrowUpRightIcon, MailIcon } from 'lucide-react'

import { profileQuery } from '@/features/profile/profile.queries'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

// On the blue band the usual focus ring, blue too, would disappear.
const BUTTON =
  'inline-flex h-12 items-center gap-2 rounded-md px-5 text-[0.9375rem] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground'

/**
 * The solid blue band that closes every page (DESIGN.md): an invitation to get
 * in touch, with the availability note from the CMS.
 */
export function ContactBand() {
  const t = useTranslation()
  const lang = useLanguage()
  const { data: profile } = useSuspenseQuery(profileQuery(lang))
  const linkedin = profile.socials.find(
    (social) => social.platform === 'linkedin',
  )

  if (!profile.email && !linkedin) return null

  return (
    <section
      aria-labelledby="contact-title"
      className="flex flex-wrap items-end justify-between gap-8 rounded-2xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-14"
    >
      <div className="flex flex-1 basis-96 flex-col gap-3.5">
        <p className="font-mono text-xs tracking-wider uppercase">
          {t.contact.label}
        </p>
        <h2
          id="contact-title"
          className="text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] font-semibold tracking-tight"
        >
          {t.contact.question}
          <br />
          {t.contact.answer}
        </h2>
        {profile.availabilityNote && (
          <p className="text-[1.0625rem]">{profile.availabilityNote}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            className={cn(BUTTON, 'bg-primary-foreground text-primary')}
          >
            <MailIcon aria-hidden className="size-4" />
            {t.profile.emailMe}
          </a>
        )}
        {linkedin && (
          // rel="me": the site owner's own profile, as in the footer.
          <a
            href={linkedin.url}
            rel="me"
            className={cn(BUTTON, 'border border-current font-medium')}
          >
            {linkedin.label}
            <ArrowUpRightIcon aria-hidden className="size-4 rtl:-scale-x-100" />
          </a>
        )}
      </div>
    </section>
  )
}
