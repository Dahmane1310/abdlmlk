/** English interface text. Its shape is the reference every other language must match. */
export const en = {
  layout: {
    skipToContent: 'Skip to content',
    mainNavigation: 'Main navigation',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    changeLanguage: 'Change language',
    languages: 'Languages',
    socialLinks: 'Social links',
  },
  nav: {
    home: 'Home',
  },
  home: {
    title: 'Portfolio under construction',
    description: 'This site is being built step by step. Come back soon.',
  },
  notFound: {
    title: 'Page not found',
    description: "The page you're looking for doesn't exist or has moved.",
    backHome: 'Back to home',
  },
  error: {
    title: 'Something went wrong',
    description: "This page couldn't be loaded. Please try again.",
    retry: 'Try again',
  },
  theme: {
    switchTo: {
      light: 'Switch to light theme',
      dark: 'Switch to dark theme',
      system: 'Use system theme',
    },
  },
}

export type Dictionary = typeof en
