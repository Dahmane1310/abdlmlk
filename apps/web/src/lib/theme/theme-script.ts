import { DEFAULT_THEME, THEME_COOKIE } from './config'

/**
 * Inlined in <head> so it runs before the first paint: sets the `dark` class
 * from the theme cookie, so the page never flashes the wrong theme. In system
 * mode it also follows the operating system when its setting changes.
 * It re-reads the cookie on every change, so it respects later choices too.
 * The same rule lives in saveTheme(); keep the two in sync.
 */
export const THEME_SCRIPT = `(() => {
  const root = document.documentElement;
  const media = matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    const match = document.cookie.match(/(?:^|; )${THEME_COOKIE}=(light|dark|system)/);
    const theme = match ? match[1] : '${DEFAULT_THEME}';
    root.classList.toggle('dark', theme === 'dark' || (theme === 'system' && media.matches));
  };
  apply();
  media.addEventListener('change', apply);
})();`
