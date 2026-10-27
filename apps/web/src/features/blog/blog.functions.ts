import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { CONTACT_ID } from '@/components/layout/contact-band'
import { CONTENT_BLOCKS_POPULATE } from '@/lib/content/blocks.schema'
import { renderContentBlocks } from '@/lib/content/blocks.server'
import { languageSchema } from '@/lib/i18n/config'
import { getStrapiClient } from '@/lib/strapi/client.server'
import { languagesOf } from '@/lib/strapi/schemas'

import { articleListSchema, seriesListSchema } from './blog.schema'
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
          // The series' published articles, in order, for "Part 2 of 3" and
          // the parts card after the text.
          series: {
            fields: ['title', 'slug'],
            populate: {
              articles: {
                fields: ['title', 'slug', 'seriesPart'],
                sort: ['seriesPart:asc'],
              },
            },
          },
          localizations: { fields: ['locale'] },
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
      languages: languagesOf(data.lang, article.localizations),
    }
  })

/**
 * A series' title and description, for its page. Its parts aren't read here:
 * the page takes them from the article list, which already has their reading
 * times and is usually cached from the blog page.
 */
export const getSeries = createServerFn({ method: 'GET' })
  .validator(z.object({ lang: languageSchema, slug: z.string() }))
  .handler(async ({ data }) => {
    const response = await getStrapiClient()
      .collection('series-list')
      .find({
        locale: data.lang,
        filters: { slug: { $eq: data.slug } },
        fields: ['title', 'slug', 'description'],
        populate: { localizations: { fields: ['locale'] } },
      })
    const series = seriesListSchema.parse(response).data.at(0)
    if (!series) throw notFound()
    return {
      ...series,
      languages: languagesOf(data.lang, series.localizations),
    }
  })

/** An article as the list shows it. */
export type ArticleSummary = Awaited<ReturnType<typeof getArticles>>[number]

/** An article as its own page shows it, blocks rendered. */
export type Article = Awaited<ReturnType<typeof getArticle>>
