import { z } from 'zod'

import { mediaSchema } from '@/lib/strapi/schemas'

const SOCIAL_PLATFORMS = [
  'linkedin',
  'github',
  'x',
  'youtube',
  'instagram',
  'facebook',
  'medium',
  'devto',
  'stackoverflow',
  'whatsapp',
  'email',
  'website',
  'other',
] as const

type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

// Brand names stay the same in every language.
const BRAND_NAMES: Partial<Record<SocialPlatform, string>> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  x: 'X',
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
  medium: 'Medium',
  devto: 'DEV',
  stackoverflow: 'Stack Overflow',
  whatsapp: 'WhatsApp',
}

/** The label set in the CMS, else the brand name, else the address itself. */
function socialLabel(link: {
  platform: SocialPlatform
  url: string
  label: string | null
}) {
  return (
    link.label ??
    BRAND_NAMES[link.platform] ??
    link.url.replace(/^(mailto:|https?:\/\/(www\.)?)/, '').replace(/\/$/, '')
  )
}

const socialLinkSchema = z
  .object({
    platform: z.enum(SOCIAL_PLATFORMS),
    url: z.url(),
    label: z.string().nullable(),
  })
  .transform((link) => ({
    platform: link.platform,
    url: link.url,
    label: socialLabel(link),
  }))

export const availabilitySchema = z.enum([
  'open_to_both',
  'open_to_work',
  'open_to_freelance',
  'not_available',
])

/** The "Profile" single type. Fields are added as pages start using them. */
export const profileSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  intro: z.string(),
  location: z.string().nullable(),
  email: z.email().nullable(),
  availability: availabilitySchema,
  availabilityNote: z.string().nullable(),
  highlights: z.array(z.object({ value: z.string(), label: z.string() })),
  resume: mediaSchema.nullable(),
  socials: z.array(socialLinkSchema),
})

export type Profile = z.output<typeof profileSchema>
export type Availability = z.output<typeof availabilitySchema>

const spokenLanguageSchema = z.object({
  name: z.string(),
  level: z.enum([
    'native',
    'fluent',
    'professional',
    'intermediate',
    'beginner',
  ]),
  /** CEFR level, e.g. "B2". */
  cefr: z.string().nullable(),
})

/**
 * Profile fields only the About page shows. Kept out of profileSchema, which
 * every page loads for the layout, so the bio isn't sent with every page.
 */
export const profileDetailsSchema = z.object({
  bio: z.string().nullable(),
  avatar: mediaSchema.nullable(),
  spokenLanguages: z.array(spokenLanguageSchema),
})

export type SpokenLanguage = z.output<typeof spokenLanguageSchema>
