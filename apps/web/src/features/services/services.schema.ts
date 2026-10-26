import { z } from 'zod'

/** A service from the "Service" collection, as Home's "What I do" shows it. */
const serviceSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  /** A Lucide icon name, e.g. "layout-dashboard" (see service-icon.tsx). */
  icon: z.string().nullable(),
})

export const serviceListSchema = z.object({
  data: z.array(serviceSchema),
})

export type Service = z.output<typeof serviceSchema>
