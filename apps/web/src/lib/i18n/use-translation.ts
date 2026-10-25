import { dictionaries } from './dictionaries'
import { useLanguage } from './use-language'

/** Interface text for the current page's language. */
export function useTranslation() {
  return dictionaries[useLanguage()]
}
