/**
 * like controller
 */

import { factories } from '@strapi/strapi';
import { hashIp } from '../../../utils/hash-ip';
import { isLanguage } from '../../../utils/validate';

export default factories.createCoreController('api::like.like', ({ strapi }) => {
  const totalFor = (article: string) =>
    strapi.documents('api::like.like').count({ filters: { articleDocumentId: article } });

  return {
    /** GET /api/likes?article=<documentId>: how many visitors like the article, its languages counted together. */
    async total(ctx) {
      const { article } = ctx.query;
      if (typeof article !== 'string' || article === '') {
        return ctx.badRequest('Query parameter "article" is required.');
      }

      ctx.body = { data: { total: await totalFor(article) } };
    },

    /** POST /api/likes { article, locale, liked }: sets whether this visitor likes the article. */
    async set(ctx) {
      const { article, locale, liked } = (ctx.request.body ?? {}) as Record<string, unknown>;
      if (typeof article !== 'string' || !isLanguage(locale) || typeof liked !== 'boolean') {
        return ctx.badRequest('Please provide an article, its language and whether you like it.');
      }

      const target = await strapi.documents('api::article.article').findOne({
        documentId: article,
        locale,
        status: 'published',
        fields: ['title'],
      });
      if (!target) return ctx.notFound('Article not found.');

      // A state, not a toggle: sending the same answer twice changes nothing,
      // so a double click or a retried request can't count twice.
      const ipHash = hashIp(ctx.request.ip);
      const existing = await strapi.documents('api::like.like').findFirst({
        filters: { articleDocumentId: article, ipHash },
      });
      if (liked && !existing) {
        await strapi.documents('api::like.like').create({ data: { articleDocumentId: article, ipHash } });
      }
      if (!liked && existing) {
        await strapi.documents('api::like.like').delete({ documentId: existing.documentId });
      }

      ctx.body = { data: { total: await totalFor(article), liked } };
    },
  };
});
