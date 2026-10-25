import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { languageSchema } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'
import { singleResponse } from '@/lib/strapi/schemas'

import { profileSchema } from './profile.schema'

export const getProfile = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .single('profile')
      .find({ locale: data.lang, populate: { socials: true } })
    return singleResponse(profileSchema).parse(response).data
  })
