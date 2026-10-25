import { Container } from '@/components/layout/container'
import { useTranslation } from '@/lib/i18n/use-translation'

export function HomePage() {
  const t = useTranslation()

  return (
    <Container className="flex flex-col gap-4 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{t.home.title}</h1>
      <p className="text-muted-foreground">{t.home.description}</p>
    </Container>
  )
}
