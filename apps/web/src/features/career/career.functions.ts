import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { languageSchema } from '@/lib/i18n/config'
import { renderMarkdown } from '@/lib/markdown/render.server'
import { getStrapiClient } from '@/lib/strapi/client.server'

import { educationListSchema, experienceListSchema } from './career.schema'

const ORGANIZATION_POPULATE = {
  fields: ['name', 'website'],
  populate: ['logo'],
}

/**
 * Months from the start month to the end month (today if still ongoing), both
 * counted: Apr 2023 to Nov 2023 is 8. Computed here, on the server, so the
 * page and the browser agree on "today".
 */
function monthsBetween(start: string, end: string | null) {
  const from = new Date(start)
  const to = end ? new Date(end) : new Date()
  return (
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    to.getUTCMonth() -
    from.getUTCMonth() +
    1
  )
}

/** Experience and education, newest first unless "order" is set in the CMS. */
export const getCareer = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema }))
  .handler(async ({ data }) => {
    const client = getStrapiClient()
    const query = {
      locale: data.lang,
      sort: ['order:asc', 'startDate:desc'],
      pagination: { pageSize: 100 },
    }
    const [experienceResponse, educationResponse] = await Promise.all([
      client.collection('experiences').find({
        ...query,
        populate: {
          organization: ORGANIZATION_POPULATE,
          technologies: { fields: ['name', 'slug'] },
        },
      }),
      client.collection('educations').find({
        ...query,
        populate: { organization: ORGANIZATION_POPULATE },
      }),
    ])

    const experience = experienceListSchema.parse(experienceResponse).data
    const education = educationListSchema.parse(educationResponse).data

    return {
      experience: await Promise.all(
        experience.map(async ({ achievements, ...job }) => ({
          ...job,
          months: monthsBetween(job.startDate, job.endDate),
          achievementsHtml: achievements
            ? await renderMarkdown(achievements)
            : null,
        })),
      ),
      education: await Promise.all(
        education.map(async ({ description, ...degree }) => ({
          ...degree,
          descriptionHtml: description
            ? await renderMarkdown(description)
            : null,
        })),
      ),
    }
  })

export type Career = Awaited<ReturnType<typeof getCareer>>
