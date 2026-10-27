import { useEffect, useState } from 'react'

/** Copies text to the clipboard; `copied` stays true for two seconds after. */
export function useCopy() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => {
      setCopied(false)
    }, 2000)
    return () => {
      clearTimeout(timer)
    }
  }, [copied])

  const copy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
      })
      // Refused (no permission, page not focused): the label stays as it was.
      .catch(() => undefined)
  }

  return { copied, copy }
}
