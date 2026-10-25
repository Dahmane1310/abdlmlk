import { DownloadIcon, MailIcon, MapPinIcon } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { AvailabilityBadge } from '@/features/profile/components/availability-badge'
import type { Profile } from '@/features/profile/profile.schema'
import { useTranslation } from '@/lib/i18n/use-translation'

export function Hero({ profile }: { profile: Profile }) {
  const t = useTranslation()

  return (
    <Container className="py-20 md:py-28">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <AvailabilityBadge
          availability={profile.availability}
          note={profile.availabilityNote}
        />
        {profile.location && (
          <p className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <MapPinIcon aria-hidden className="size-3.5" />
            {profile.location}
          </p>
        )}
      </div>

      <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
        {profile.fullName}
      </h1>
      <p className="mt-3 font-mono text-lg text-primary sm:text-xl">
        {profile.headline}
      </p>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        {profile.intro}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        {profile.email && (
          <Button asChild size="lg">
            <a href={`mailto:${profile.email}`}>
              <MailIcon aria-hidden />
              {t.home.emailMe}
            </a>
          </Button>
        )}
        {profile.resume && (
          <Button asChild size="lg" variant="outline">
            <a href={profile.resume.url} download>
              <DownloadIcon aria-hidden />
              {t.home.downloadCv}
            </a>
          </Button>
        )}
      </div>
    </Container>
  )
}
