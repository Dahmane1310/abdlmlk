import type { Dictionary } from './en'

export const fr = {
  layout: {
    skipToContent: 'Aller au contenu',
    mainNavigation: 'Navigation principale',
    menu: 'Menu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    changeLanguage: 'Changer de langue',
    languages: 'Langues',
    socialLinks: 'Réseaux sociaux',
  },
  nav: {
    home: 'Accueil',
    about: 'À propos',
    projects: 'Projets',
  },
  dates: {
    present: "Aujourd'hui",
  },
  home: {
    highlights: 'Chiffres clés',
  },
  profile: {
    emailMe: "M'écrire",
    downloadCv: 'Télécharger le CV',
    languageLevels: {
      native: 'Langue maternelle',
      fluent: 'Courant',
      professional: 'Professionnel',
      intermediate: 'Intermédiaire',
      beginner: 'Débutant',
    },
  },
  about: {
    title: 'À propos',
    description:
      "Qui je suis, où j'ai travaillé, ce que j'ai étudié et les langues que je parle.",
    experience: 'Expérience',
    skills: 'Compétences',
    education: 'Formation',
    spokenLanguages: 'Langues parlées',
    status: 'Statut',
    currently: 'Actuellement',
    basedIn: 'Basé à',
    workingSince: 'Actif depuis',
  },
  technologies: {
    categories: {
      language: 'Langages',
      frontend: 'Frontend',
      backend: 'Backend',
      mobile: 'Mobile',
      ai: 'IA',
      database: 'Bases de données',
      devops: 'DevOps',
      tool: 'Outils',
    },
  },
  career: {
    current: 'Actuel',
    employmentTypes: {
      full_time: 'Temps plein',
      part_time: 'Temps partiel',
      freelance: 'Freelance',
      contract: 'Contrat',
      internship: 'Stage',
      co_founder: 'Cofondateur',
    },
    workModes: {
      remote: 'Télétravail',
      onsite: 'Sur site',
      hybrid: 'Hybride',
    },
  },
  availability: {
    open_to_both: 'Disponible',
    open_to_work: 'Disponible',
    open_to_freelance: 'Disponible en freelance',
    not_available: 'Indisponible',
  },
  projects: {
    eyebrow: 'Travaux sélectionnés',
    title: 'Projets',
    description:
      "Des produits et des projets clients que j'ai réalisés, de la conception à la mise en production.",
    filters: 'Filtrer les projets',
    type: 'Type',
    technology: 'Technologie',
    all: 'Tous',
    empty: 'Aucun projet ne correspond à ces filtres.',
    showAll: 'Voir tous les projets',
    visitSite: 'Voir le site',
    sourceCode: 'Code source',
    types: {
      client: 'Projet client',
      product: 'Produit',
      personal: 'Projet personnel',
      academic: 'Projet académique',
    },
    backToAll: 'Tous les projets',
    role: 'Rôle',
    client: 'Client',
    builtAt: 'Réalisé chez',
    dates: 'Période',
    keyNumbers: 'Chiffres clés',
    techStack: 'Technologies',
    gallery: 'Galerie',
    moreProjects: 'Autres projets',
    previous: 'Projet précédent',
    next: 'Projet suivant',
  },
  content: {
    callout: {
      note: 'Remarque',
      tip: 'Astuce',
      warning: 'Attention',
      danger: 'Important',
    },
  },
  notFound: {
    title: 'Page introuvable',
    description: "La page que vous cherchez n'existe pas ou a été déplacée.",
    backHome: "Retour à l'accueil",
  },
  error: {
    title: 'Une erreur est survenue',
    description: "Cette page n'a pas pu être chargée. Veuillez réessayer.",
    retry: 'Réessayer',
  },
  theme: {
    switchTo: {
      light: 'Passer au thème clair',
      dark: 'Passer au thème sombre',
      system: 'Utiliser le thème du système',
    },
  },
} satisfies Dictionary
