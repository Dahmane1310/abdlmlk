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
- `apps/cms/.env`: Strapi secrets (`APP_KEYS`, `*_SALT`, `*_SECRET`, `ENCRYPTION_KEY`), `HOST`, `PORT`, plus `PUBLIC_URL`, `IS_PROXIED`, `PROXY_IP_HEADER` and the database (`DATABASE_CLIENT`, `DATABASE_URL`) in production (see "Deploying"). Generated locally by `create-strapi`; never commit it. Optional extras (see [`apps/cms/.env.example`](apps/cms/.env.example)):
  - `SITE_URL`: the website's URL, used in newsletter links, and the only origin allowed to call the public endpoints from a browser
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

## Deploying (Dokploy)

Production runs on a VPS with [Dokploy](https://dokploy.com): the site and the CMS are two applications next to a PostgreSQL database, behind Dokploy's Traefik (HTTPS certificates from Let's Encrypt) and Cloudflare's proxy (SSL/TLS mode **Full (strict)**).

| Service | Image | Address | Port |
| --- | --- | --- | --- |
| CMS | `ghcr.io/dahmane1310/abdlmlk-cms`, from `apps/cms/Dockerfile` | `https://cms.abdlmlk.com` | 1337 |
| Site | `ghcr.io/dahmane1310/abdlmlk-web`, from `apps/web/Dockerfile` | `https://abdlmlk.com` (`www.` redirects to it) | 3000 |
| Database | Dokploy PostgreSQL | inside Dokploy's network only | 5432 |

### Builds

The images are built by GitHub Actions, not on the VPS: it has 3.7 GB of memory shared with other apps, and building Strapi's admin panel there ran it out. On a push to `main`, [`.github/workflows/cms.yml`](.github/workflows/cms.yml) and [`web.yml`](.github/workflows/web.yml) rebuild the app whose files changed (or both, for the workspace files), push the image to GitHub's container registry, then call that app's Dokploy deploy webhook; Dokploy pulls the new image and restarts the app. Either workflow can also be run by hand from the repository's Actions tab.

Set up once:

- **Repository secrets** (Settings → Secrets and variables → Actions): `DOKPLOY_CMS_WEBHOOK` and `DOKPLOY_WEB_WEBHOOK`, each app's webhook URL from Dokploy (the app → Deployments → Webhook URL).
- **Public images:** after the first build, each package (`abdlmlk-cms`, `abdlmlk-web` on the GitHub profile's Packages tab) set to public in its settings, so Dokploy can pull it without a token. The images hold no secrets: settings come from Dokploy at run time.

### CMS settings

Environment variables (see [`apps/cms/.env.example`](apps/cms/.env.example)):

```
NODE_ENV=production
APP_KEYS=…                 # four random values, comma-separated
API_TOKEN_SALT=…           # each one random: openssl rand -base64 32
ADMIN_JWT_SECRET=…
TRANSFER_TOKEN_SALT=…
JWT_SECRET=…
ENCRYPTION_KEY=…
DATABASE_CLIENT=postgres
DATABASE_URL=…             # Dokploy's internal connection URL for the database
PUBLIC_URL=https://cms.abdlmlk.com
IS_PROXIED=true
PROXY_IP_HEADER=CF-Connecting-IP
SITE_URL=https://abdlmlk.com   # also the only origin allowed to call the public endpoints (CORS)
OWNER_EMAIL=…              # optional, with SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
```

A volume keeps uploaded files across deploys: mounted at `/app/apps/cms/public/uploads`.

### Site settings

- Build argument `VITE_STRAPI_URL=https://cms.abdlmlk.com`: baked into the browser bundle, so changing it needs a rebuild.
- Environment variables: `STRAPI_URL`, the CMS's address inside Dokploy's network (how the server reads content), and `SITE_URL=https://abdlmlk.com` (canonical links, link previews, the feeds and the sitemap).

### First deploy

1. **Create the admin account** at `https://cms.abdlmlk.com/admin` as soon as the CMS first starts: until then, whoever opens that page first could claim it.
2. **Copy the local content** (entries and uploaded files) to production with Strapi's transfer. In the production admin, Settings → Transfer Tokens → create a token with "Push" access. Then, locally, with the local CMS stopped:

   ```sh
   pnpm --filter cms strapi transfer --to https://cms.abdlmlk.com/admin --to-token <token>
   ```

   It replaces production's content with the local content.

### Backups

- **The database:** Dokploy's scheduled backups for the PostgreSQL service.
- **Uploaded files:** the uploads volume.
