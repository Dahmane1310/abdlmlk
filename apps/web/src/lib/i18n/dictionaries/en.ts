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
    projects: 'Projects',
  },
  home: {
    emailMe: 'Email me',
    downloadCv: 'Download CV',
    highlights: 'Highlights',
  },
  // Shown when the CMS has no availability note.
  availability: {
    open_to_both: 'Open to remote roles and freelance projects',
    open_to_work: 'Open to new roles',
    open_to_freelance: 'Available for freelance projects',
    not_available: 'Not available right now',
  },
  projects: {
    title: 'Projects',
    description:
      "Products and client work I've built, from planning to production.",
    filters: 'Filter projects',
    type: 'Type',
    technology: 'Technology',
    all: 'All',
    empty: 'No projects match these filters.',
    showAll: 'Show all projects',
    visitSite: 'Visit site',
    sourceCode: 'Source code',
    present: 'Present',
    types: {
      client: 'Client project',
      product: 'Product',
      personal: 'Personal project',
      academic: 'Academic project',
    },
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
