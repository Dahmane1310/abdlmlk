import type { Core } from '@strapi/strapi';

/**
 * Strapi 5 lets anyone with read permission fetch drafts by adding ?status=draft.
 * Only authenticated requests (API token or user JWT) may ask for drafts.
 */
const draftsGuard: Core.MiddlewareFactory = () => async (ctx, next) => {
  if (ctx.path.startsWith('/api/') && ctx.query.status === 'draft' && !ctx.request.headers.authorization) {
    return ctx.unauthorized('Draft content requires authentication.');
  }
  await next();
};

export default draftsGuard;
