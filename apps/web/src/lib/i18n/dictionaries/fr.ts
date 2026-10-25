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
