import type { Core } from '@strapi/strapi';

// English is Strapi's default locale; these are added on first start.
const EXTRA_LOCALES = [
  { code: 'ar', name: 'Arabic (ar)' },
  { code: 'fr', name: 'French (fr)' },
];

// Content the website reads without authentication. Comments, likes,
// newsletter and contact use their own public endpoints instead.
const PUBLIC_READ: Record<string, string[]> = {
  'api::profile.profile': ['find'],
  'api::site-setting.site-setting': ['find'],
  'api::organization.organization': ['find', 'findOne'],
  'api::technology.technology': ['find', 'findOne'],
  'api::project.project': ['find', 'findOne'],
  'api::experience.experience': ['find', 'findOne'],
  'api::education.education': ['find', 'findOne'],
  'api::service.service': ['find', 'findOne'],
  'api::testimonial.testimonial': ['find', 'findOne'],
  'api::article.article': ['find', 'findOne'],
  'api::tag.tag': ['find', 'findOne'],
  'api::series.series': ['find', 'findOne'],
};

async function ensureLocales(strapi: Core.Strapi) {
  const locales = strapi.plugin('i18n').service('locales');
  const existing: Array<{ code: string }> = await locales.find();
  for (const locale of EXTRA_LOCALES) {
    if (!existing.some(({ code }) => code === locale.code)) {
      await locales.create(locale);
      strapi.log.info(`[bootstrap] added locale ${locale.code}`);
    }
  }
}

async function ensurePublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  const permissions = strapi.db.query('plugin::users-permissions.permission');
  for (const [uid, actions] of Object.entries(PUBLIC_READ)) {
    for (const action of actions.map((name) => `${uid}.${name}`)) {
      const exists = await permissions.findOne({ where: { action, role: publicRole.id } });
      if (!exists) await permissions.create({ data: { action, role: publicRole.id } });
    }
  }
}

export default {
  register() {},

  /** Runs on every start, so a fresh database (e.g. on the VPS) is ready without manual setup. */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureLocales(strapi);
    await ensurePublicPermissions(strapi);
  },
};
