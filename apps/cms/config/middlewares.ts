import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    // Only the website may call the public endpoints from a browser (likes,
    // responses, the newsletter). The admin panel is on the CMS's own address.
    config: { origin: [(env('SITE_URL') || 'http://localhost:3000').replace(/\/$/, '')] },
  },
  'strapi::poweredBy',
  'strapi::query',
  'global::drafts-guard',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
