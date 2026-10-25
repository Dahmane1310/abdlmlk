import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { Container } from './container'

/** 404 content. Rendered inside the site layout. */
export function NotFoundPage() {
  const t = useTranslation()
  const lang = useLanguage()

  return (
    <Container className="flex flex-col items-start gap-4 py-24">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">
        {t.notFound.title}
      </h1>
      <p className="text-muted-foreground">{t.notFound.description}</p>
      <Button asChild className="mt-2">
        <Link to="/$lang" params={{ lang }}>
          {t.notFound.backHome}
        </Link>
      </Button>
    </Container>
  )
}
