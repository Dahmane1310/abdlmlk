import { useSyncExternalStore } from 'react'

// Whether the reader likes an article, kept in this browser: enough to fill
// the heart. The CMS keeps its own like per visitor, so a cleared or blocked
// storage only changes what the button shows.
const listeners = new Set<() => void>()
const storageKey = (article: string) => `liked:${article}`

function read(article: string) {
  try {
    return localStorage.getItem(storageKey(article)) === '1'
  } catch {
    return false
  }
}

function write(article: string, liked: boolean) {
  try {
    if (liked) localStorage.setItem(storageKey(article), '1')
    else localStorage.removeItem(storageKey(article))
  } catch {
    // Private windows and blocked storage: not remembered.
  }
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Whether the reader likes an article. The server renders "not liked", and the
 * browser swaps in the stored answer after hydration, so the two never disagree.
 */
export function useStoredLike(article: string) {
  const liked = useSyncExternalStore(
    subscribe,
    () => read(article),
    () => false,
  )
  const setLiked = (value: boolean) => {
    write(article, value)
  }
  return { liked, setLiked }
}
