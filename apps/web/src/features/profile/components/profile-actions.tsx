import { DownloadIcon, MailIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import type { Profile } from '../profile.schema'

/** "Email me" and "Download CV" buttons, each shown when the profile has it. */
export function ProfileActions({
  profile,
  className,
}: {
  profile: Pick<Profile, 'email' | 'resume'>
  className?: string
}) {
  const t = useTranslation()

  if (!profile.email && !profile.resume) return null

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {profile.email && (
        <Button asChild size="lg">
          <a href={`mailto:${profile.email}`}>
            <MailIcon aria-hidden />
            {t.profile.emailMe}
          </a>
        </Button>
      )}
      {profile.resume && (
        <Button asChild size="lg" variant="outline">
          <a href={profile.resume.url} download>
            <DownloadIcon aria-hidden />
            {t.profile.downloadCv}
          </a>
        </Button>
      )}
    </div>
  )
}
