/**
 * message controller: contact form
 */

import { factories } from '@strapi/strapi';
import { cleanText, isEmail, isLanguage } from '../../../utils/validate';
import { ownerEmail, sendMail } from '../../../utils/mail';

const REASONS = ['job', 'freelance', 'collaboration', 'other'] as const;
type Reason = (typeof REASONS)[number];
const isReason = (value: unknown): value is Reason =>
  typeof value === 'string' && (REASONS as readonly string[]).includes(value);

/** Optional text: missing or empty is fine, too long is an error. */
function optionalText(value: unknown, max: number) {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return { ok: true, value: undefined };
  const text = cleanText(value, { max });
  return { ok: text !== undefined, value: text };
}

export default factories.createCoreController('api::message.message', ({ strapi }) => ({
  /** POST /api/contact { name, email, subject?, body, reason?, budget?, language? } */
  async submit(ctx) {
    const input = (ctx.request.body ?? {}) as Record<string, unknown>;
    const { email } = input;
    const name = cleanText(input.name, { min: 2, max: 120 });
    const body = cleanText(input.body, { min: 10, max: 5000 });
    const subject = optionalText(input.subject, 200);
    const budget = optionalText(input.budget, 100);

    if (!name || !body || !isEmail(email) || !subject.ok || !budget.ok) {
      return ctx.badRequest('Please provide your name, a valid email and a message of at least 10 characters.');
    }
    const reason = isReason(input.reason) ? input.reason : 'other';
    const language = isLanguage(input.language) ? input.language : 'en';

    const created = await strapi.documents('api::message.message').create({
      data: {
        name,
        email: email.trim().toLowerCase(),
        subject: subject.value,
        body,
        reason,
        budget: budget.value,
        language,
        status: 'new',
      },
    });

    const owner = ownerEmail();
    if (owner) {
      const messageUrl = `${strapi.config.get('admin.absoluteUrl')}/content-manager/collection-types/api::message.message/${created.documentId}`;
      const details = [`Reason: ${reason}`, budget.value && `Budget: ${budget.value}`, `Language: ${language}`]
        .filter(Boolean)
        .join('\n');
      void sendMail(strapi, {
        to: owner,
        replyTo: email.trim(),
        subject: `[Contact] ${subject.value ?? reason}, from ${name}`,
        text: `${name} <${email.trim()}>\n${details}\n\n${body}\n\nIn the admin: ${messageUrl}`,
      });
    }

    ctx.body = { data: { ok: true } };
  },
}));
