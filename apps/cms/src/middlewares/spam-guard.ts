import type { Core } from '@strapi/strapi';

// captcha: false for endpoints without a form to show the widget in (likes).
type Config = { max?: number; windowMs?: number; captcha?: boolean };

// Recent request times per IP + path. In memory: fine for a single server, resets on restart.
const hits = new Map<string, number[]>();

function prune(now: number, windowMs: number) {
  for (const [key, times] of hits) {
    if (times.every((time) => now - time >= windowMs)) hits.delete(key);
  }
}

async function verifyTurnstile(secret: string, token: unknown, ip: string) {
  if (typeof token !== 'string' || token === '') return false;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

/**
 * Protects the public endpoints (comments, newsletter, contact, likes):
 * - honeypot: a hidden "website" field that real visitors leave empty
 * - rate limit per IP and path
 * - Cloudflare Turnstile check, only when TURNSTILE_SECRET_KEY is set and the endpoint asks for it
 */
const spamGuard: Core.MiddlewareFactory<Config> = (config) => {
  const max = config?.max ?? 5;
  const windowMs = config?.windowMs ?? 10 * 60 * 1000;
  const captcha = config?.captcha ?? true;

  return async (ctx, next) => {
    const body = (ctx.request.body ?? {}) as Record<string, unknown>;

    // Bots fill every field. Answer like a success so they don't adapt.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      ctx.body = { data: { ok: true } };
      return;
    }

    const now = Date.now();
    const key = `${ctx.request.ip}:${ctx.path}`;
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
    if (recent.length >= max) {
      ctx.set('Retry-After', String(Math.ceil((windowMs - (now - recent[0])) / 1000)));
      return ctx.tooManyRequests('Too many requests. Please try again later.');
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) prune(now, windowMs);

    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (captcha && secret && !(await verifyTurnstile(secret, body.turnstileToken, ctx.request.ip))) {
      return ctx.badRequest('Captcha verification failed.');
    }

    delete body.website;
    delete body.turnstileToken;
    await next();
  };
};

export default spamGuard;
