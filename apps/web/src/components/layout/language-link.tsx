import { Link } from '@tanstack/react-router'

import { writeBrowserCookie } from '@/lib/cookies'
import { LANGUAGE_COOKIE, LANGUAGE_NAMES } from '@/lib/i18n/config'
import type { Language } from '@/lib/i18n/config'

type LanguageLinkProps = Omit<
  React.ComponentProps<'a'>,
  'href' | 'lang' | 'hrefLang'
> & {
  language: Language
}

/**
 * Links to the current page in another language and remembers the choice,
 * so "/" sends the visitor back to it. Forwards other props, so it works
 * inside menus that pass their own (e.g. DropdownMenuItem with asChild).
 */
export function LanguageLink({
  language,
  children,
  onClick,
  ...props
}: LanguageLinkProps) {
  return (
    <Link
      {...props}
      to="."
      params={(previous) => ({ ...previous, lang: language })}
      lang={language}
      hrefLang={language}
      onClick={(event) => {
        writeBrowserCookie(LANGUAGE_COOKIE, language)
        onClick?.(event)
      }}
    >
      {children ?? LANGUAGE_NAMES[language]}
    </Link>
  )
}
