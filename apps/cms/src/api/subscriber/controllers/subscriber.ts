/**
 * subscriber controller: newsletter with double opt-in
 */

import { randomBytes } from 'node:crypto';
import { factories } from '@strapi/strapi';
import { isEmail, isLanguage, siteUrl, type Language } from '../../../utils/validate';
import { escapeHtml, sendMail } from '../../../utils/mail';

const newToken = () => randomBytes(24).toString('hex');

const CONFIRM_EMAIL: Record<Language, { subject: string; intro: string; button: string; ignore: string }> = {
  en: {
    subject: 'Confirm your subscription',
    intro: 'Thanks for subscribing to my blog! Please confirm your email address:',
    button: 'Confirm my subscription',
    ignore: "If you didn't subscribe, you can ignore this email.",
  },
  ar: {
    subject: 'أكّد اشتراكك',
    intro: 'شكرًا لاشتراكك في مدونتي! يُرجى تأكيد بريدك الإلكتروني:',
    button: 'تأكيد الاشتراك',
    ignore: 'إذا لم تشترك، يمكنك تجاهل هذه الرسالة.',
  },
  fr: {
    subject: 'Confirmez votre abonnement',
    intro: 'Merci de vous être abonné à mon blog ! Veuillez confirmer votre adresse e-mail :',
    button: 'Confirmer mon abonnement',
    ignore: "Si vous ne vous êtes pas abonné, vous pouvez ignorer cet e-mail.",
  },
};

function confirmationEmail(language: Language, link: string) {
  const copy = CONFIRM_EMAIL[language];
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  return {
    subject: copy.subject,
    text: `${copy.intro}\n\n${link}\n\n${copy.ignore}`,
    html: `<div dir="${dir}" style="font-family:system-ui,sans-serif;line-height:1.6">
<p>${escapeHtml(copy.intro)}</p>
<p><a href="${link}" style="display:inline-block;padding:10px 18px;background:#173a40;color:#fff;border-radius:8px;text-decoration:none">${escapeHtml(copy.button)}</a></p>
<p style="color:#666;font-size:13px">${escapeHtml(copy.ignore)}</p>
</div>`,
  };
}

export default factories.createCoreController('api::subscriber.subscriber', ({ strapi }) => {
  const subscribers = () => strapi.documents('api::subscriber.subscriber');
  const apiUrl = () => `${strapi.config.get('server.absoluteUrl')}/api/newsletter`;

  return {
    /** POST /api/newsletter/subscribe { email, language }: sends a confirmation email. */
    async subscribe(ctx) {
      const input = (ctx.request.body ?? {}) as Record<string, unknown>;
      const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
      if (!isEmail(email)) return ctx.badRequest('Please provide a valid email address.');
      const language = isLanguage(input.language) ? input.language : 'en';

      const existing = await subscribers().findFirst({ filters: { email } });
      // Same answer whether or not the address is already subscribed, so the list can't be probed.
      if (existing?.status === 'subscribed') {
        ctx.body = { data: { ok: true } };
        return;
      }

      const confirmToken = newToken();
      if (existing) {
        await subscribers().update({ documentId: existing.documentId, data: { status: 'pending', language, confirmToken } });
      } else {
        await subscribers().create({
          data: { email, language, status: 'pending', confirmToken, unsubscribeToken: newToken() },
        });
      }

      const link = `${apiUrl()}/confirm?token=${confirmToken}`;
      const sent = await sendMail(strapi, { to: email, ...confirmationEmail(language, link) });
      if (!sent) strapi.log.info(`[newsletter] confirmation link for ${email}: ${link}`);

      ctx.body = { data: { ok: true } };
    },

    /** GET /api/newsletter/confirm?token=…: link from the confirmation email. */
    async confirm(ctx) {
      const { token } = ctx.query;
      const subscriber =
        typeof token === 'string' && token !== '' && (await subscribers().findFirst({ filters: { confirmToken: token } }));
      if (!subscriber) return ctx.redirect(`${siteUrl()}/?newsletter=invalid`);

      // Replace the token so the confirmation link only works once.
      await subscribers().update({
        documentId: subscriber.documentId,
        data: { status: 'subscribed', confirmedAt: new Date().toISOString(), confirmToken: newToken() },
      });
      ctx.redirect(`${siteUrl()}/${subscriber.language}?newsletter=confirmed`);
    },

    /**
     * GET or POST /api/newsletter/unsubscribe?token=…
     * GET is the link in each email; POST supports one-click unsubscribe from mail apps.
     */
    async unsubscribe(ctx) {
      const { token } = ctx.query;
      const subscriber =
        typeof token === 'string' && token !== '' && (await subscribers().findFirst({ filters: { unsubscribeToken: token } }));
      if (!subscriber) {
        return ctx.method === 'GET' ? ctx.redirect(`${siteUrl()}/?newsletter=invalid`) : ctx.notFound('Unknown subscription.');
      }

      await subscribers().update({
        documentId: subscriber.documentId,
        data: { status: 'unsubscribed', unsubscribedAt: new Date().toISOString() },
      });
      if (ctx.method === 'GET') return ctx.redirect(`${siteUrl()}/${subscriber.language}?newsletter=unsubscribed`);
      ctx.body = { data: { ok: true } };
    },
  };
});
