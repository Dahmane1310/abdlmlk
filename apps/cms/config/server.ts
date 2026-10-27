import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Behind a reverse proxy (Traefik in Dokploy), set PUBLIC_URL to the public
  // https URL and IS_PROXIED=true so admin cookies and links use it.
  url: env('PUBLIC_URL'),
  proxy: {
    koa: env.bool('IS_PROXIED', false),
    // Which header holds the visitor's IP: the spam limits and likes count per
    // visitor. Behind Cloudflare, CF-Connecting-IP, which Cloudflare sets and a
    // visitor can't fake (unlike the start of X-Forwarded-For).
    ipHeader: env('PROXY_IP_HEADER', 'X-Forwarded-For'),
  },
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
