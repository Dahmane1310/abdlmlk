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
    projects: 'Projets',
  },
  home: {
    emailMe: "M'écrire",
    downloadCv: 'Télécharger le CV',
    highlights: 'Chiffres clés',
  },
  availability: {
    open_to_both: 'Ouvert aux postes en télétravail et aux missions freelance',
    open_to_work: 'Ouvert à de nouvelles opportunités',
    open_to_freelance: 'Disponible pour des missions freelance',
    not_available: 'Indisponible pour le moment',
  },
  projects: {
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
    present: "Aujourd'hui",
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
    results: 'Résultats',
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
