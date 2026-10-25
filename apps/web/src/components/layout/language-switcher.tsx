import { CheckIcon, LanguagesIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LANGUAGE_NAMES, LANGUAGES } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'

import { LanguageLink } from './language-link'

export function LanguageSwitcher() {
  const t = useTranslation()
  const current = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <LanguagesIcon aria-hidden />
          {/* The visible code stays part of the accessible name (WCAG "label in name"). */}
          <span className="sr-only">{t.layout.changeLanguage}</span>{' '}
          <span className="font-mono text-xs uppercase">{current}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem key={language} asChild>
            <LanguageLink
              language={language}
              aria-current={language === current ? 'true' : undefined}
            >
              <span className="flex-1">{LANGUAGE_NAMES[language]}</span>
              {language === current && <CheckIcon aria-hidden />}
            </LanguageLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
