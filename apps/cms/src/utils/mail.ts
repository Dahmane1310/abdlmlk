import type { Core } from '@strapi/strapi';

type Mail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export const isMailConfigured = () => Boolean(process.env.SMTP_HOST);

/** Address that receives contact messages and new-comment notifications. */
export const ownerEmail = () => process.env.OWNER_EMAIL || undefined;

/**
 * Sends an email through the email plugin. Never throws: a skipped or failed
 * email must not fail the visitor's request.
 */
export async function sendMail(strapi: Core.Strapi, mail: Mail) {
  if (!isMailConfigured()) {
    strapi.log.info(`[mail] SMTP is not configured, skipped "${mail.subject}" to ${mail.to}`);
    return false;
  }
  try {
    await strapi.plugin('email').service('email').send(mail);
    return true;
  } catch (error) {
    strapi.log.error(`[mail] could not send "${mail.subject}" to ${mail.to}: ${(error as Error).message}`);
    return false;
  }
}

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
