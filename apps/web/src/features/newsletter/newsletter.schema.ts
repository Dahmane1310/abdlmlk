import { z } from 'zod'

import type { Dictionary } from '@/lib/i18n/dictionaries/en'

/** The sign-up form, with the page's language for the message; the CMS checks again. */
export const newsletterFormSchema = (
  errors: Dictionary['newsletter']['errors'],
) =>
  z.object({
    email: z.email({ error: errors.email }).max(254, { error: errors.email }),
    // The honeypot: people never see it, bots fill it in.
    website: z.string(),
  })

export type NewsletterFormValues = z.input<
  ReturnType<typeof newsletterFormSchema>
>

/**
 * POST /api/newsletter/subscribe: always "ok", whether or not the address was
 * already on the list, so the list can't be probed.
 */
export const subscribeResultSchema = z.object({
  data: z.object({ ok: z.literal(true) }),
})

/**
 * ?newsletter= on Home, set by the CMS when a reader follows a link from one
 * of its emails. Anything else is ignored.
 */
export const newsletterSearchSchema = z.object({
  newsletter: z
    .enum(['confirmed', 'unsubscribed', 'invalid'])
    .optional()
    .catch(undefined),
})
