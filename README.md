# abdlmlk

Portfolio monorepo: a TanStack Start site and a Strapi 5 CMS, managed with pnpm workspaces and Turborepo.

| App | What | Local URL |
| --- | --- | --- |
| [`apps/web`](apps/web) | TanStack Start site (reads content from Strapi) | http://localhost:3000 |
| [`apps/cms`](apps/cms) | Strapi 5 CMS with SQLite | http://localhost:1337/admin |

Requires Node 24 and pnpm 12.

## Local development

```bash
pnpm install
pnpm --filter cms seed   # loads the portfolio content in en/ar/fr (only runs on an empty database)
pnpm dev                 # starts the site and the CMS together
```

On first start, open http://localhost:1337/admin and create your admin account.

| Command | Does |
| --- | --- |
| `pnpm dev` | Run both apps in dev mode |
| `pnpm build` | Build both apps (cached by Turbo) |
| `pnpm --filter web <script>` | Run a script in the site only |
| `pnpm --filter cms <script>` | Run a script in the CMS only |

## Environment

- `apps/web/.env.local`: `VITE_STRAPI_URL`, the public Strapi URL. It is baked into the build, so rebuild after changing it.
- `apps/cms/.env`: Strapi secrets (`APP_KEYS`, `*_SALT`, `*_SECRET`, `ENCRYPTION_KEY`), `HOST`, `PORT`, plus `PUBLIC_URL` and `IS_PROXIED` in production. Generated locally by `create-strapi`; never commit it. Optional extras (see [`apps/cms/.env.example`](apps/cms/.env.example)):
  - `SITE_URL`: the website's URL, used in newsletter links
  - `OWNER_EMAIL`: where contact messages and new-comment alerts go
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: email sending. Without `SMTP_HOST`, emails are skipped and newsletter confirmation links are written to the CMS log instead.
  - `TURNSTILE_SECRET_KEY`: turns on a Cloudflare Turnstile captcha for the public forms

Turbo runs tasks in strict env mode: variables that come from your shell are only passed to a task if they're listed in [`turbo.json`](turbo.json). Vite and Strapi read their own `.env` files, so those always work.

## CMS

Content is available in English (`en`, default), Arabic (`ar`) and French (`fr`); pass `?locale=` on API requests. Languages and public read permissions are set up automatically when Strapi starts.

| Type | What |
| --- | --- |
| Profile, Site settings | Single entries: bio, availability, socials, spoken languages, default SEO |
| Project | Case studies with blocks, results, tech stack, client and live/repo links |
| Experience, Education | CV timeline, linked to organizations |
| Service, Testimonial | Freelance offer and recommendations |
| Technology, Organization | Shared lists, not translated |
| Article, Tag, Series | Blog posts with code and callout blocks, multi-part series |
| Comment, Subscriber, Message | Filled by visitors; managed in the admin only |
| Like | Likes on articles, one entry per visitor and article; filled by the site only |

Public endpoints, protected by a honeypot field (`website`), per-IP rate limits and the optional captcha (`turnstileToken`; not asked for likes, which have no form):

| Endpoint | Does |
| --- | --- |
| `GET /api/comments?article=<documentId>&locale=<en\|ar\|fr>` | Approved comments for a post |
| `POST /api/comments` | New comment, held as pending until you approve it in the admin |
| `POST /api/newsletter/subscribe` | Sends a confirmation email in the subscriber's language |
| `GET /api/newsletter/confirm?token=…`, `/unsubscribe?token=…` | Links from emails; redirect back to `SITE_URL` |
| `POST /api/contact` | Saves a contact message and emails it to `OWNER_EMAIL` |
| `GET /api/likes?article=<documentId>` | How many visitors like an article, its languages counted together |
| `POST /api/likes` | Sets whether a visitor likes an article (`article`, `locale`, `liked`); one like per visitor |

Anonymous requests for drafts (`?status=draft`) are refused.

## Deploying to the VPS

1. Install Node 24, then run `corepack enable` so the pinned pnpm is used.
2. Clone the repo and run `pnpm install --frozen-lockfile`.
3. Create the env files:
   - `apps/cms/.env`: copy `.env.example`, then replace every secret with a fresh random value (`openssl rand -base64 32`; `APP_KEYS` takes four, comma-separated). Also set:
     ```
     HOST=127.0.0.1
     PUBLIC_URL=https://cms.example.com
     IS_PROXIED=true
     SITE_URL=https://example.com
     OWNER_EMAIL=you@example.com
     SMTP_HOST=…   # plus SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
     ```
   - `apps/web/.env.production.local`: `VITE_STRAPI_URL=https://cms.example.com`
4. Run `pnpm build`, then `pnpm --filter cms seed` once to load the portfolio content (or copy your local `apps/cms/.tmp/data.db` and `apps/cms/public/uploads/` over instead).
5. Run each app as its own service, not through Turbo (Turbo would strip env vars set by the service manager). Example systemd units:

   ```ini
   # /etc/systemd/system/portfolio-cms.service
   [Unit]
   Description=Portfolio CMS (Strapi)
   After=network.target

   [Service]
   WorkingDirectory=/srv/abdlmlk/apps/cms
   Environment=NODE_ENV=production
   ExecStart=/usr/bin/env pnpm start
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

   ```ini
   # /etc/systemd/system/portfolio-web.service
   [Unit]
   Description=Portfolio site (TanStack Start)
   After=network.target

   [Service]
   WorkingDirectory=/srv/abdlmlk/apps/web
   Environment=NODE_ENV=production HOST=127.0.0.1 PORT=3000
   ExecStart=/usr/bin/env node .output/server/index.mjs
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

6. Put Caddy in front. It handles HTTPS automatically:

   ```
   example.com {
     reverse_proxy 127.0.0.1:3000
   }

   cms.example.com {
     reverse_proxy 127.0.0.1:1337
   }
   ```

To update the site later: `git pull && pnpm install --frozen-lockfile && pnpm build`, then restart both services.

### Backups

All content lives in two places that are not in git. Back them up:

- `apps/cms/.tmp/data.db`: the SQLite database
- `apps/cms/public/uploads/`: uploaded images and files
