import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { CONTACT_ID } from '@/components/layout/contact-band'
import { CONTENT_BLOCKS_POPULATE } from '@/lib/content/blocks.schema'
import { renderContentBlocks } from '@/lib/content/blocks.server'
import { languageSchema } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'

import { articleListSchema } from './blog.schema'
import { readingMinutes } from './reading-time'

const ARTICLE_POPULATE = {
  cover: true,
  tags: { fields: ['name', 'slug'] },
  series: { fields: ['title', 'slug'] },
  blocks: CONTENT_BLOCKS_POPULATE,
  seo: { populate: ['shareImage'] },
}

/**
 * Every published article, newest first, as the list shows it: the blocks are
 * only read to work out the reading time, and each article in a series knows
 * how many parts the series has.
 */
export const getArticles = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .collection('articles')
      .find({
        locale: data.lang,
        sort: ['publishedDate:desc', 'title:asc'],
        pagination: { pageSize: 100 },
        populate: ARTICLE_POPULATE,
      })
    const articles = articleListSchema.parse(response).data

    return articles.map(({ blocks, ...article }) => ({
      ...article,
      readingMinutes: readingMinutes(blocks ?? []),
      seriesTotal: article.series
        ? articles.filter(
            (other) => other.series?.slug === article.series?.slug,
          ).length
        : null,
    }))
  })

export const getArticle = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema, slug: z.string() }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .collection('articles')
      .find({
        locale: data.lang,
        filters: { slug: { $eq: data.slug } },
        populate: {
          ...ARTICLE_POPULATE,
          // The series' published articles, to say "Part 2 of 3".
          series: {
            fields: ['title', 'slug'],
            populate: { articles: { fields: ['slug'] } },
          },
        },
      })
    // .at() is typed as possibly undefined, so the 404 check is real to TypeScript.
    const article = articleListSchema.parse(response).data.at(0)
    if (!article) throw notFound()

    const blocks = article.blocks ?? []
    // Headings get ids for the table of contents; the page's own ids (the
    // contact band's) are taken, so a heading named "Contact" can't steal it.
    const rendered = await renderContentBlocks(blocks, {
      headingIds: new Set([CONTACT_ID]),
    })
    return {
      ...article,
      readingMinutes: readingMinutes(blocks),
      seriesTotal: article.series?.articles?.length ?? null,
      blocks: rendered,
      headings: rendered.flatMap((block) =>
        block.type === 'rich-text' ? block.headings : [],
      ),
    }
  })

/** An article as the list shows it. */
export type ArticleSummary = Awaited<ReturnType<typeof getArticles>>[number]

/** An article as its own page shows it, blocks rendered. */
export type Article = Awaited<ReturnType<typeof getArticle>>
