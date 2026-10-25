import { z } from 'zod'

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

/** The "Profile" single type. Fields are added as pages start using them. */
export const profileSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  socials: z.array(socialLinkSchema),
})
