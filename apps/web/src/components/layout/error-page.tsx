import { useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n/use-translation'

import { Container } from './container'

/**
 * Shown when a page can't load, e.g. the CMS is unreachable. Uses only the
 * dictionaries, never CMS data, so it can render when the CMS is down.
 */
export function ErrorPage({ error }: ErrorComponentProps) {
  const t = useTranslation()
  const router = useRouter()

  return (
    <Container className="flex flex-col items-start gap-4 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">{t.error.title}</h1>
      <p className="text-muted-foreground">{t.error.description}</p>
      {import.meta.env.DEV && (
        <pre className="max-w-full overflow-x-auto rounded-md border bg-muted p-3 font-mono text-xs">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      )}
      <Button
        className="mt-2"
        onClick={() => {
          // Re-runs the loaders, which also resets this error.
          void router.invalidate()
        }}
      >
        {t.error.retry}
      </Button>
    </Container>
  )
}
