'use strict';

/**
 * Fills an empty database with the portfolio content from data/portfolio.json,
 * in English, Arabic and French. Run with `pnpm seed`.
 */

const data = require('../data/portfolio.json');
const blog = require('../data/blog.json');

const LOCALES = ['en', 'ar', 'fr'];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function lookup(map, key, kind, file = 'data/portfolio.json') {
  if (!map[key]) throw new Error(`Unknown ${kind} "${key}" in ${file}`);
  return map[key];
}

// Creates the English entry, then adds the Arabic and French versions to the same document.
// Relations and slugs are stored per language in Strapi 5, so shared fields go into every locale.
async function createInLocales(uid, shared, localized, { publish = false } = {}) {
  const status = publish ? { status: 'published' } : {};
  const first = await strapi
    .documents(uid)
    .create({ locale: LOCALES[0], data: { ...shared, ...localized(LOCALES[0]) }, ...status });
  for (const locale of LOCALES.slice(1)) {
    await strapi
      .documents(uid)
      .update({ documentId: first.documentId, locale, data: { ...shared, ...localized(locale) }, ...status });
  }
  return first.documentId;
}

async function seed() {
  if (await strapi.documents('api::profile.profile').findFirst({ locale: 'en' })) {
    console.log('A profile already exists. The seed only runs on an empty database.');
    return;
  }

  const organizations = {};
  for (const { key, ...organization } of data.organizations) {
    const doc = await strapi.documents('api::organization.organization').create({ data: { ...organization, slug: key } });
    organizations[key] = doc.documentId;
  }

  const technologies = {};
  for (const technology of data.technologies) {
    const slug = slugify(technology.name);
    const doc = await strapi.documents('api::technology.technology').create({ data: { ...technology, slug } });
    technologies[slug] = doc.documentId;
  }

  // The JSON file uses readable keys; turn them into relation payloads.
  const withRelations = ({ organization, client, technologies: techs, ...rest }) => ({
    ...rest,
    ...(organization && { organization: { connect: [{ documentId: lookup(organizations, organization, 'organization') }] } }),
    ...(client && { client: { connect: [{ documentId: lookup(organizations, client, 'organization') }] } }),
    ...(techs && {
      technologies: { connect: techs.map((slug) => ({ documentId: lookup(technologies, slug, 'technology') })) },
    }),
  });

  // Markdown strings in "content" become a single rich-text block.
  const withBlocks = ({ content, ...rest }) => ({
    ...rest,
    ...(content && { content: [{ __component: 'shared.rich-text', body: content }] }),
  });

  const createLocalized = (uid, entry, options) =>
    createInLocales(
      uid,
      withRelations(entry.shared ?? {}),
      (locale) => withBlocks(entry[locale]),
      options
    );

  await createLocalized('api::site-setting.site-setting', data.siteSetting);
  await createLocalized('api::profile.profile', data.profile);
  for (const experience of data.experiences) await createLocalized('api::experience.experience', experience);
  for (const education of data.educations) await createLocalized('api::education.education', education);
  for (const project of data.projects) await createLocalized('api::project.project', project, { publish: true });
  for (const service of data.services) await createLocalized('api::service.service', service);

  console.log(
    `Seeded in ${LOCALES.join(', ')}: profile, site settings, ${data.experiences.length} experiences, ` +
      `${data.educations.length} educations, ${data.projects.length} projects, ${data.services.length} services, ` +
      `${data.organizations.length} organizations and ${data.technologies.length} technologies.`
  );
}

// data/blog.json writes blocks in shorthand: a list of strings is Markdown paragraphs,
// { code } names one of the article's code snippets (the same in every language),
// { callout } and { quote } are the other blocks.
function articleBlocks(blocks, code) {
  return blocks.map((block) => {
    if (Array.isArray(block)) return { __component: 'shared.rich-text', body: block.join('\n\n') };
    if (block.code) {
      const snippet = lookup(code, block.code, 'code snippet', 'data/blog.json');
      return { __component: 'shared.code', ...snippet, code: snippet.code.join('\n') };
    }
    if (block.callout) {
      return { __component: 'shared.callout', variant: block.callout, title: block.title, body: block.body };
    }
    if (block.quote) return { __component: 'shared.quote', body: block.quote, title: block.cite };
    throw new Error(`Unknown block in data/blog.json: ${JSON.stringify(block)}`);
  });
}

// Runs on its own condition (no articles yet), so it also fills a database seeded before the blog existed.
async function seedBlog() {
  if (await strapi.documents('api::article.article').findFirst({ locale: 'en', status: 'draft' })) {
    console.log('Articles already exist. The blog seed only runs when there are none.');
    return;
  }

  const connectByKey = (map, keys, kind) => ({
    connect: keys.map((key) => ({ documentId: lookup(map, key, kind, 'data/blog.json') })),
  });

  const tags = {};
  for (const { slug, ...names } of blog.tags) {
    tags[slug] = await createInLocales('api::tag.tag', { slug }, (locale) => names[locale]);
  }
  const series = {};
  for (const { slug, ...texts } of blog.series) {
    series[slug] = await createInLocales('api::series.series', { slug }, (locale) => texts[locale]);
  }
  for (const article of blog.articles) {
    const { tags: tagKeys, series: seriesKey, ...shared } = article.shared;
    await createInLocales(
      'api::article.article',
      {
        ...shared,
        tags: connectByKey(tags, tagKeys, 'tag'),
        ...(seriesKey && { series: connectByKey(series, [seriesKey], 'series') }),
      },
      (locale) => {
        const { blocks, ...texts } = article[locale];
        return { ...texts, blocks: articleBlocks(blocks, article.code ?? {}) };
      },
      { publish: true }
    );
  }

  console.log(
    `Seeded the blog in ${LOCALES.join(', ')}: ${blog.articles.length} articles, ` +
      `${blog.series.length} series and ${blog.tags.length} tags.`
  );
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  await seed();
  await seedBlog();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
