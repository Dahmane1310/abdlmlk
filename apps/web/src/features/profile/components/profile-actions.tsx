import { MailIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/utils'

import type { Profile } from '../profile.schema'
import { DownloadCvButton } from './download-cv-button'

/**
 * "Email me" and "Download CV" buttons, each shown when the profile has it,
 * then any extra actions passed as children (Home's "See my work").
 */
export function ProfileActions({
  profile,
  className,
  children,
}: {
  profile: Pick<Profile, 'email' | 'resume'>
  className?: string
  children?: React.ReactNode
}) {
  const t = useTranslation()

  if (!profile.email && !profile.resume && !children) return null

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
      {profile.resume && <DownloadCvButton resume={profile.resume} />}
      {children}
    </div>
  )
}
