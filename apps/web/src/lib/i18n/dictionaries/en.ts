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
    about: 'About',
    projects: 'Projects',
  },
  dates: {
    // End of a date range that hasn't ended: "Jun 2024 — Present".
    present: 'Present',
  },
  home: {
    highlights: 'Highlights',
  },
  profile: {
    emailMe: 'Email me',
    downloadCv: 'Download CV',
    languageLevels: {
      native: 'Native',
      fluent: 'Fluent',
      professional: 'Professional',
      intermediate: 'Intermediate',
      beginner: 'Beginner',
    },
  },
  about: {
    title: 'About',
    description:
      "Where I've worked, the tools I use, what I studied and the languages I speak.",
    heading: 'Experience & skills',
    lead: 'The jobs, tools and studies behind my work.',
    experience: 'Experience',
    skills: 'Skills',
    education: 'Education',
    spokenLanguages: 'Spoken languages',
  },
  // The blue band that closes every page.
  contact: {
    label: 'Contact',
    question: 'Have a project in mind?',
    answer: "Let's build it.",
  },
  technologies: {
    categories: {
      language: 'Languages',
      frontend: 'Frontend',
      backend: 'Backend',
      mobile: 'Mobile',
      ai: 'AI',
      database: 'Databases',
      devops: 'DevOps',
      tool: 'Tools',
    },
  },
  career: {
    // Between a degree and its field: "Master's degree, Software Engineering".
    fieldSeparator: ', ',
    current: 'Current',
    employmentTypes: {
      full_time: 'Full-time',
      part_time: 'Part-time',
      freelance: 'Freelance',
      contract: 'Contract',
      internship: 'Internship',
      co_founder: 'Co-founder',
    },
    workModes: {
      remote: 'Remote',
      onsite: 'On-site',
      hybrid: 'Hybrid',
    },
  },
  // Availability in a few words, after a coloured dot: "● Open to work".
  availability: {
    open_to_both: 'Open to work',
    open_to_work: 'Open to work',
    open_to_freelance: 'Open to freelance',
    not_available: 'Not available',
  },
  projects: {
    eyebrow: 'Selected work',
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
    types: {
      client: 'Client project',
      product: 'Product',
      personal: 'Personal project',
      academic: 'Academic project',
    },
    backToAll: 'All projects',
    role: 'Role',
    client: 'Client',
    builtAt: 'Built at',
    dates: 'Dates',
    keyNumbers: 'Key numbers',
    techStack: 'Tech stack',
    gallery: 'Gallery',
    moreProjects: 'More projects',
    previous: 'Previous project',
    next: 'Next project',
  },
  content: {
    // Callout titles when the CMS block has none.
    callout: {
      note: 'Note',
      tip: 'Tip',
      warning: 'Warning',
      danger: 'Important',
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
