import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { languageSchema } from '@/lib/i18n/config'
import { renderMarkdown } from '@/lib/markdown/render.server'
import { getStrapiClient } from '@/lib/strapi/client.server'
import { singleResponse } from '@/lib/strapi/schemas'

import { profileDetailsSchema, profileSchema } from './profile.schema'

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

export const getProfileDetails = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .single('profile')
      .find({
        locale: data.lang,
        fields: ['bio'],
        populate: { avatar: true, spokenLanguages: true },
      })
    const { bio, ...details } =
      singleResponse(profileDetailsSchema).parse(response).data
    return { ...details, bioHtml: bio ? await renderMarkdown(bio) : null }
  })

export type ProfileDetails = Awaited<ReturnType<typeof getProfileDetails>>
