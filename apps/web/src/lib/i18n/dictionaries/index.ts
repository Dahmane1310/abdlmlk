import type { Language } from '../config'
import { ar } from './ar'
import { en } from './en'
import type { Dictionary } from './en'
import { fr } from './fr'

export const dictionaries: Record<Language, Dictionary> = { en, ar, fr }
