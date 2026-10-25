import { createServerFn } from '@tanstack/react-start'
import { getCookie, getRequestHeader } from '@tanstack/react-start/server'

import { isLanguage, LANGUAGE_COOKIE } from './config'
import { negotiateLanguage } from './negotiate'

/** The visitor's language: the one they last chose, else their browser's preference. */
export const getPreferredLanguage = createServerFn({ method: 'GET' }).handler(
  () => {
    const saved = getCookie(LANGUAGE_COOKIE)
    if (isLanguage(saved)) return saved
    return negotiateLanguage(getRequestHeader('accept-language'))
  },
)
