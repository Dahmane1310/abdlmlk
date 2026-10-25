'use strict';

/**
 * Fills an empty database with the portfolio content from data/portfolio.json,
 * in English, Arabic and French. Run with `pnpm seed`.
 */

const data = require('../data/portfolio.json');

const LOCALES = ['en', 'ar', 'fr'];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function lookup(map, key, kind) {
  if (!map[key]) throw new Error(`Unknown ${kind} "${key}" in data/portfolio.json`);
  return map[key];
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

  // Creates the English entry, then adds the Arabic and French versions to the same document.
  // Relations and slugs are stored per language in Strapi 5, so shared fields go into every locale.
  async function createLocalized(uid, entry, { publish = false } = {}) {
    const shared = withRelations(entry.shared ?? {});
    const status = publish ? { status: 'published' } : {};
    const first = await strapi
      .documents(uid)
      .create({ locale: LOCALES[0], data: { ...shared, ...withBlocks(entry[LOCALES[0]]) }, ...status });
    for (const locale of LOCALES.slice(1)) {
      await strapi
        .documents(uid)
        .update({ documentId: first.documentId, locale, data: { ...shared, ...withBlocks(entry[locale]) }, ...status });
    }
  }

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

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  await seed();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
