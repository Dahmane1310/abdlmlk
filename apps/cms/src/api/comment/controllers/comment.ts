/**
 * comment controller
 */

import { factories } from '@strapi/strapi';
import { hashIp } from '../../../utils/hash-ip';
import { cleanText, isEmail, isLanguage } from '../../../utils/validate';
import { ownerEmail, sendMail } from '../../../utils/mail';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  /** GET /api/comments?article=<documentId>&locale=<en|ar|fr>: approved comments, oldest first. */
  async list(ctx) {
    const { article, locale } = ctx.query;
    if (typeof article !== 'string' || !isLanguage(locale)) {
      return ctx.badRequest('Query parameters "article" and "locale" are required.');
    }

    const comments = await strapi.documents('api::comment.comment').findMany({
      filters: { status: 'approved', article: { documentId: article, locale } },
      fields: ['authorName', 'body', 'isAuthorReply', 'createdAt'],
      populate: { parent: { fields: ['createdAt'] } },
      sort: 'createdAt:asc',
      limit: 500,
    });

    ctx.body = {
      data: comments.map((comment) => ({
        documentId: comment.documentId,
        authorName: comment.authorName,
        body: comment.body,
        isAuthorReply: comment.isAuthorReply,
        createdAt: comment.createdAt,
        parent: comment.parent?.documentId ?? null,
      })),
    };
  },

  /** POST /api/comments: stores the comment as pending and notifies the owner. */
  async submit(ctx) {
    const input = (ctx.request.body ?? {}) as Record<string, unknown>;
    const { article, locale, parent, authorEmail } = input;
    const authorName = cleanText(input.authorName, { min: 2, max: 80 });
    const body = cleanText(input.body, { min: 2, max: 4000 });

    if (typeof article !== 'string' || !isLanguage(locale) || !authorName || !body || !isEmail(authorEmail)) {
      return ctx.badRequest('Please provide your name, a valid email and a comment.');
    }

    const target = await strapi.documents('api::article.article').findOne({
      documentId: article,
      locale,
      status: 'published',
      fields: ['title', 'allowComments'],
    });
    if (!target) return ctx.notFound('Article not found.');
    if (target.allowComments === false) return ctx.forbidden('Comments are closed for this article.');

    if (parent != null) {
      const parentComment =
        typeof parent === 'string' &&
        (await strapi.documents('api::comment.comment').findFirst({
          filters: { documentId: parent, status: 'approved', article: { documentId: article, locale } },
        }));
      if (!parentComment) return ctx.badRequest('The comment you are replying to does not exist.');
    }

    const created = await strapi.documents('api::comment.comment').create({
      data: {
        authorName,
        authorEmail: authorEmail.trim().toLowerCase(),
        body,
        status: 'pending',
        ipHash: hashIp(ctx.request.ip),
        // Linked to the article's draft entry: Strapi recreates the published entry on every
        // publish, while the draft entry stays, so the link survives edits.
        article: { documentId: article, locale },
        ...(typeof parent === 'string' && { parent: { documentId: parent } }),
      },
    });

    const owner = ownerEmail();
    if (owner) {
      const reviewUrl = `${strapi.config.get('admin.absoluteUrl')}/content-manager/collection-types/api::comment.comment/${created.documentId}`;
      void sendMail(strapi, {
        to: owner,
        subject: `New comment on "${target.title}"`,
        text: `${authorName} (${authorEmail}) wrote:\n\n${body}\n\nApprove or reject it: ${reviewUrl}`,
      });
    }

    ctx.body = { data: { ok: true, status: 'pending' } };
  },
}));
