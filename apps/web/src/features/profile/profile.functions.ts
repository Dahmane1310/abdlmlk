import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { languageSchema } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'
import { singleResponse } from '@/lib/strapi/schemas'

import { profileLanguagesSchema, profileSchema } from './profile.schema'

export const getProfile = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .single('profile')
      .find({
        locale: data.lang,
        populate: { socials: true, highlights: true, resume: true },
      })
    return singleResponse(profileSchema).parse(response).data
  })

export const getSpokenLanguages = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .single('profile')
      .find({
        locale: data.lang,
        // Strapi sends every text field unless told otherwise, the bio included.
        fields: ['documentId'],
        populate: { spokenLanguages: true },
      })
    return singleResponse(profileLanguagesSchema).parse(response).data
      .spokenLanguages
  })
