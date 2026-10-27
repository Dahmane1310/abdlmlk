import { CheckIcon, CopyIcon } from 'lucide-react'

import { useTranslation } from '@/lib/i18n/use-translation'
import { useCopy } from '@/lib/use-copy'

/** Copies a code block's text; says "Copied" for two seconds after a click. */
export function CopyButton({ text }: { text: string }) {
  const t = useTranslation()
  const { copied, copy } = useCopy()

  return (
    <button
      type="button"
      onClick={() => {
        copy(text)
      }}
      className="ms-auto inline-flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {copied ? (
        <CheckIcon aria-hidden className="size-3.5 text-primary" />
      ) : (
        <CopyIcon aria-hidden className="size-3.5" />
      )}
      {/* Announced when it changes, so screen reader users hear "Copied". */}
      <span aria-live="polite">
        {copied ? t.content.copied : t.content.copy}
      </span>
    </button>
  )
}
