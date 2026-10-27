import { createHash } from 'node:crypto';

/** Tells visitors apart (a repeat spammer, one like each) without storing raw IP addresses. */
export const hashIp = (ip: string) =>
  createHash('sha256').update(`${ip}:${process.env.API_TOKEN_SALT ?? ''}`).digest('hex').slice(0, 32);
