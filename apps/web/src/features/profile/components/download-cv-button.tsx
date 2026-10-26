import { DownloadIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/use-translation'

import type { Profile } from '../profile.schema'

export function DownloadCvButton({
  resume,
}: {
  resume: NonNullable<Profile['resume']>
}) {
  const t = useTranslation()

  return (
    <Button asChild size="lg" variant="outline">
      <a href={resume.url} download>
        <DownloadIcon aria-hidden />
        {t.profile.downloadCv}
      </a>
    </Button>
  )
}
