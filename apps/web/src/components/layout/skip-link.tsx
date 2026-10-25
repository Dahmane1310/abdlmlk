import { useTranslation } from '@/lib/i18n/use-translation'

/** Lets keyboard users jump past the header. Hidden until focused. */
export function SkipLink() {
  const t = useTranslation()

  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-4 focus:z-50"
    >
      {t.layout.skipToContent}
    </a>
  )
}
