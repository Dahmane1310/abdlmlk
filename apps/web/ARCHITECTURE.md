# Web app architecture

How `apps/web` is built: the structure, the rules and the reasons behind them. Every change follows this document. When a decision changes, this document changes in the same step.

## What it is

A portfolio and personal blog in English, Arabic and French. Content comes from the Strapi CMS in `apps/cms`. The site renders pages on the server and adds interactivity in the browser.

| Concern                              | Tool                                                            |
| ------------------------------------ | --------------------------------------------------------------- |
| Framework, routing, server rendering | TanStack Start + TanStack Router                                |
| Server data and caching              | Server functions + TanStack Query                               |
| CMS access                           | `@strapi/client`, on the server only                            |
| Validation and types                 | Zod                                                             |
| Forms                                | TanStack Form + Zod                                             |
| UI components                        | shadcn/ui                                                       |
| Styling                              | Tailwind CSS v4                                                 |
| Icons                                | Lucide (interface), Simple Icons (technology logos)             |
| Fonts                                | IBM Plex Sans, IBM Plex Sans Arabic, IBM Plex Mono, self-hosted |
| Markdown and code                    | Rendered to HTML on the server, code highlighted with Shiki     |

## Folder structure

Folders appear when the first file needs them; nothing is created ahead of time.

```
src/
  routes/                      URL structure only. Thin files: validate params, load data, set <head>, render a feature
    __root.tsx                 <html> shell: lang, dir, theme, fonts
    index.tsx                  "/" redirects to the visitor's language
    $lang/
      route.tsx                validates the language, renders header and footer
      index.tsx                home
      about.tsx
      contact.tsx
      projects/index.tsx, projects/$slug.tsx
      blog/index.tsx, blog/$slug.tsx, blog/tags/$tag.tsx, blog/series/$slug.tsx

  features/                    one folder per domain, everything about it in one place
    projects/
      projects.schema.ts       Zod schemas for CMS data + the inferred types
      projects.functions.ts    server functions that read from Strapi
      projects.queries.ts      TanStack Query options (keys + fetchers)
      components/              UI used only by this feature
    home/  profile/  career/  services/  testimonials/  technologies/
    blog/  comments/  newsletter/  contact/

  components/
    ui/                        shadcn components, generated then adapted to our design
    layout/                    site shell, shared by every page:
                               site-layout (skip link + header + <main> + footer), site-header, site-footer,
                               mobile-menu, nav-items (the one list of nav links), language-switcher,
                               language-link, theme-toggle, container (page width), not-found-page,
                               error-page (CMS unreachable; dictionaries only, no CMS data)
    content/                   shared content display: rendered markdown, content blocks, responsive image

  lib/
    strapi/
      client.server.ts         Strapi SDK client (server only), built per request from the environment
      public-api.ts            browser calls to Strapi's public form endpoints (forms step)
      schemas.ts               shared Zod schemas: media (absolute URL), SEO, the { data } wrapper
      media.ts                 absolute URLs for uploads (srcset comes with the first images)
    i18n/
      config.ts                supported languages, default, text direction, language cookie
      negotiate.ts             picks a language from the browser's Accept-Language header
      language.functions.ts    server function: the visitor's preferred language, for the "/" redirect
      use-language.ts          hook: current page's language, for components outside /$lang route files
      use-translation.ts       hook: the current language's dictionary
      dictionaries/            en.ts (reference shape), ar.ts, fr.ts
      format.ts                dates via Intl: month + year, date ranges ("Apr 2023 — Present")
    markdown/
      render.server.ts         markdown → HTML + table of contents, code highlighting
    theme/
      config.ts                themes (light, dark, system), default, cookie
      theme.ts                 read the cookie (server and browser), save a choice
      theme-script.ts          inline <head> script: applies the theme before first paint
    cookies.ts                 read and write preference cookies in the browser (theme, language)
    utils.ts                   cn() class helper

  styles/
    app.css                    Tailwind, design tokens, fonts
  env.ts                       public environment variables (VITE_…), validated with Zod
  env.server.ts                server-only environment variables, read per request
  vite-env.d.ts                types for import.meta.env
  router.tsx                   router + Query client setup
  routeTree.gen.ts             generated by TanStack Router, never edited
```

**Rule of thumb:** code used by one feature lives in that feature's folder. Code used by two or more features moves to `components/` or `lib/`.

## Reading data

```
route loader ──► queryClient.query({ ...projectQuery(lang, slug), staleTime: 'static' })
                       │   runs on the server during SSR, in the browser on navigation
                       ▼
                 getProject({ data: { lang, slug } })      server function (an RPC call from the browser)
                       │
                       ▼
                 Strapi client ──► GET /api/projects?locale=ar&…
                       │
                       ▼
                 Zod parse ──► normalize ──► plain, typed data

component ──► useSuspenseQuery(projectQuery(lang, slug))   reads the cache filled by the loader
```

- **Strapi stays behind the server function.** Components never see Strapi's response shapes. Server functions validate the response with Zod, then **normalize** it: absolute image URLs with `srcset`, markdown already rendered to HTML, only the fields the UI needs.
- **Loaders are isomorphic.** They run on the server _and_ in the browser, so they only call server functions, never Strapi or `process.env` directly.
- **Loaders use `queryClient.query({ ...options, staleTime: 'static' })`**: cached data is used as is, only missing data is fetched. (`ensureQueryData` does the same but is deprecated.)
- **Server rendering hands the cache to the browser.** Data loaded during SSR is sent with the page, so the browser doesn't fetch it again: zero server function calls after a page loads.
- **Cached for 5 minutes by default** (`staleTime` in the Query client). CMS content changes rarely; without it, every query would refetch right after hydration.
- **Queries are keyed by language,** so switching language never shows content from the wrong language.
- **Layout data loads in the root route's `beforeLoad`.** The header, footer and `<head>` need the site settings and profile on every page, including root-level 404s that never reach `$lang`. `beforeLoad` gets the URL, so it loads them for the language in the path. Page data belongs in each page's own loader.
- **If the CMS is unreachable,** the root `errorComponent` shows a translated error page (status 500) with a "Try again" button that re-runs the loaders. It only uses the dictionaries, since CMS data is exactly what's missing. Error details show in development only.
- **Missing content** (an unknown slug) throws `notFound()`, which renders the 404 page.
- **404s always show the site layout,** with a real 404 status:
  - An unknown page under a valid language (`/en/nope`) is caught by the `$lang` route, inside its layout.
  - An unknown language (`/de`) fails inside `$lang` itself, so its layout never renders. That `notFound()` targets the root route (`routeId: rootRouteId`), whose 404 wraps the page in the layout.

## Writing data (forms)

Comments, newsletter and contact **post directly from the browser to Strapi's public endpoints**, through `lib/strapi/public-api.ts`.

**Why:** Strapi's spam protection limits requests per visitor IP. Through our server, every visitor would share the server's IP, and one spammer could block everyone.

**Flow:** TanStack Form validates the input with the feature's Zod schema → a TanStack Query mutation sends it → the form shows the pending, error and success states. Strapi validates again; the client check exists for instant feedback, not for security.

## Where state lives

| State                            | Lives in                                   | Why                                                                   |
| -------------------------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| Language                         | URL: `/ar/...`                             | Shareable, indexable, one source of truth                             |
| Search, filters, pagination      | URL search params, validated by the router | Shareable links, back button works                                    |
| CMS content                      | TanStack Query cache                       | Cached between pages, preloaded on hover                              |
| Theme (light, dark, system)      | Cookie, exposed through the root loader    | Readable on the server and in the browser; switching needs no request |
| Open menus, dialogs, form inputs | Component state                            | Local by nature                                                       |

There is no global store. Adding one needs a real cross-page state that none of the above fits.

## Languages and right-to-left

- **Languages:** English (`en`, default), Arabic (`ar`, right-to-left), French (`fr`).
- **The URL decides the language.** `$lang/route.tsx` validates it; anything else is a 404.
- **`/` redirects:** to the language last chosen (cookie), else the browser's preferred language, else English.
- **`<html lang dir>`** is set in the root shell from the current language, so the browser, screen readers and search engines know the language and direction.
- **Interface text** (buttons, labels) lives in `lib/i18n/dictionaries/`. `en.ts` defines the shape; `ar.ts` and `fr.ts` must match it, so a missing translation fails the type check.
- **CMS content** is requested with `locale` = the current language. Slugs are the same in every language, so the language switcher only swaps the URL prefix.
- **Dates and numbers** use `Intl`. Arabic uses Latin digits (`ar-u-nu-latn`) to match the CMS content, which is written with Latin digits ("19/20", "15–25%").
- **Numbers, ranges and codes inside Arabic text** go in `<span dir="ltr">`. Otherwise the browser reorders them right to left: "15–25%" shows as "25%–15".
- **Layout direction:** only logical utilities (`ms-*`, `pe-*`, `inset-s-*`, `inset-e-*`, `text-start`), never `left`/`right`, so the layout mirrors itself in Arabic. Tailwind 4.3 names the inset ones `inset-s`/`inset-e`; `start-*`/`end-*` are the old names. Exceptions use the `rtl:` variant, e.g. `rtl:rotate-180` on arrow icons.
- **Radix components** (menus, sheets) take their direction from `Direction.Provider` in the root shell, not from `<html dir>`; without it, keyboard navigation would run the wrong way in Arabic.
- **shadcn's `rtl` option** is on in `components.json`, so generated components use logical classes. Sheets open from `start` or `end`, not left or right.
- **The language switcher** keeps the visitor on the same page and only swaps the prefix. Language names are always shown in their own language (العربية, Français), each marked with `lang` and `hreflang`.

## Styling and UI

- **Design:** modern and techy, flat. 1px borders, high contrast, one accent colour (electric blue), monospace for details (dates, labels, numbers). No gradients, glows or decorative shadows.
- **Design tokens** (colours, fonts, radius) are CSS variables in `styles/app.css`, exposed to Tailwind as `bg-primary`, `text-muted-foreground`, `border-input` and so on. Components use tokens, never raw colour values. Names follow shadcn's convention:
  - `primary` is the brand colour (electric blue): links, main buttons, focus ring.
  - `accent` is shadcn's subtle **hover background**, not the brand colour.
  - `border` is for decorative lines (cards, dividers); `input` is the stronger border for form controls.
- **Contrast** meets WCAG AA in both themes: text 4.5:1 or more, input borders and focus ring 3:1 or more. Check new colours before adding them.
- **Light and dark** themes come from a `.dark` class on `<html>`. In dark mode the blue is brighter and buttons use dark text on it, to keep contrast.
  - An inline script in `<head>` sets the class from the theme cookie before the first paint, so the page never flashes the wrong theme. In system mode it follows the operating system live.
  - **React never renders that class.** If it did, switching from an explicit theme back to system would make React remove a class the script had set. So the script owns the class at load and `saveTheme()` owns it after a click; the two share the same rule.
  - The toggle reads the theme from the root loader and calls `router.invalidate()` after saving, so its icon updates without a network request.
- **Fonts** are self-hosted with Fontsource: IBM Plex Sans (variable, all weights in one file), IBM Plex Sans Arabic (Arabic characters only, downloaded only on pages with Arabic text) and IBM Plex Mono. Arabic gets a taller line height. Plex Mono has no Arabic letters, so the mono font list falls back to Plex Sans Arabic; without it, Arabic in mono text (labels, the site name) renders disconnected. Only load-bearing weights exist: Mono comes in 400 and 500, so mono text never uses `font-semibold`, which the browser would fake.
- **shadcn components** are generated into `components/ui/` and then ours to adapt. Features compose them; they don't restyle them ad hoc. After `shadcn add`, review every generated file:
  - **Imports:** shadcn 4.21+ rewrites `@/lib/utils` to an npm package named `cn` that it doesn't install. Change it back to `import { cn } from '@/lib/utils'`; we keep the local helper.
  - **Flat design:** remove decorative shadows (`shadow-*`) and raw colours (`bg-black/50` and similar) in favour of tokens.
  - **Language:** replace hardcoded English text (e.g. screen-reader labels) with props filled from the dictionaries, as `SheetContent`'s required `closeLabel` does.
  - **Next.js leftovers:** remove `"use client"`; it means nothing here and adds build warnings.
- **Images:** `ResponsiveImage` (`components/content/`) renders CMS images with a `srcset` built from Strapi's generated sizes (thumbnail, small, medium, large and the original), a `sizes` hint from the caller, explicit width and height to prevent layout shift, and lazy loading unless `priority`. Without alt text an image is decorative (`alt=""`).
- **Missing images get a designed placeholder,** never a broken image: e.g. project covers show the project's initials until a cover is uploaded. Arabic initials are joined with a zero-width non-joiner, so they stay separate letters instead of joining into a word.
- **Technology logos:** looked up from Simple Icons on the server and sent as SVG path data, so the browser never downloads the icon library.
- **Accessibility:** semantic HTML, every control reachable by keyboard, visible focus, labelled inputs, sufficient contrast, motion reduced when the visitor asks for it.

## Server and security rules

- **Server-only files** end in `.server.ts` (or import `@tanstack/react-start/server-only`). The build refuses to put them in the browser bundle.
- **Server functions** validate their input with Zod (`.validator(schema)`) and use `GET` for reads.
- **Environment variables** are validated in `env.ts`. Server variables are read inside server functions, never at module level. Only `VITE_`-prefixed variables reach the browser, and they hold nothing secret.
  - `VITE_STRAPI_URL` (required, `env.ts`): Strapi's public URL, for images and form posts from the browser. Baked in at build time.
  - `STRAPI_URL` (optional, `env.server.ts`): how the server reaches Strapi. In production, Strapi's internal address on Dokploy's Docker network (set up in the deployment step). Falls back to `VITE_STRAPI_URL`.
  - Both are listed in `.env.example`; copy it to `.env.local` for development.
- **Drafts are never requested.** The site only reads published content.

## Conventions

- **Imports** use the `@/` alias for `src/` (a `tsconfig.json` path, resolved by Vite; shadcn is configured for it too).
- **File names** are kebab-case: `project-card.tsx`, `use-translation.ts`. One component per file, named exports. Route files export `Route`, as TanStack Router requires.
- **Types come from Zod** (`z.infer`), never hand-written copies of the same shape.
- **Route files stay thin.** Params, loader, `head` (SEO) and one feature component. Logic and markup live in `features/`.
- **Page titles** are set in the route's `head`: "Page — Site name", with the page name from `dictionaries[params.lang]` and the site name from the root's context. They replace the root's default title and description.
- **URL filters** use a Zod `validateSearch` schema with `.catch(undefined)` on each field, so a bad value (`?type=bogus`) is ignored instead of crashing the page. Filter links use `activeOptions={{ exact: true }}` (so "All" is only active when nothing is set) and `resetScroll={false}` (the page doesn't jump to the top).
- **CMS dates** are plain days ("2023-04-01"). Format them with `lib/i18n/format.ts`, which formats in UTC; local-time formatting shows the previous month in time zones behind UTC.
- **Comments explain why, not what.** No dead or commented-out code.
- **Every step passes** `pnpm lint`, `pnpm typecheck`, `pnpm format:check` and `pnpm build` before it's reviewed, and is checked in the running app when it changes behaviour. **Check in a real browser, not only the server HTML:** errors that happen after hydration (in the browser) don't show up in the HTML the server sends.

## Tooling

- **ESLint 10** (`eslint.config.js`): typescript-eslint strict and stylistic rules with type information, React Hooks, accessibility rules (strict), and the TanStack Query (strict) and Router plugins. Accessibility rules come from `eslint-plugin-jsx-a11y-x`, a maintained fork of `eslint-plugin-jsx-a11y` (unmaintained since 2024, no ESLint 10 support); its rule names start with `jsx-a11y-x/`.
- **Prettier** (`.prettierrc.json`): no semicolons, single quotes, trailing commas, Tailwind classes sorted automatically. It runs last in the ESLint config so the two never disagree.
- **VS Code** (`.vscode/` at the repo root): formats on save and applies ESLint fixes on save. Recommended extensions are listed for the workspace.

## Decision log

| Decision                                               | Why                                                                                                                                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TanStack Start, Router and Query                       | Already in place; type-safe routing, SSR and caching that work together                                                                                                              |
| No global store                                        | Every piece of state has a better home (see "Where state lives")                                                                                                                     |
| Forms post straight to Strapi                          | Per-visitor spam limits need the visitor's real IP                                                                                                                                   |
| Zod at every boundary                                  | One schema gives runtime safety and the TypeScript type                                                                                                                              |
| Markdown and Shiki on the server                       | Smaller pages; the browser doesn't download a parser or highlighter                                                                                                                  |
| IBM Plex family                                        | One type family for English, French and Arabic, with a matching mono                                                                                                                 |
| Typed dictionaries instead of an i18n library          | Around 100 interface strings; TypeScript enforces complete translations                                                                                                              |
| Arabic dates and numbers with Latin digits             | Consistent with the CMS content                                                                                                                                                      |
| `@/` as the only import alias                          | Owner's preference; one alias instead of two                                                                                                                                         |
| ESLint 10 + Prettier                                   | TanStack and accessibility lint rules catch real bugs; Prettier ends style debates. ESLint 9 is no longer supported.                                                                 |
| `eslint-plugin-jsx-a11y-x` for accessibility rules     | The original plugin is unmaintained and stuck on ESLint 9; the fork (es-tooling) is maintained and supports ESLint 10. Owner accepted its 0.x version.                               |
| Deployed with Dokploy                                  | Owner's VPS setup: Docker containers behind Traefik, configured in the deployment step                                                                                               |
| Electric blue accent, cool-tinted neutrals             | Owner's choice; techy and high contrast without gradients                                                                                                                            |
| Separate `input` border token                          | Form controls need 3:1 contrast; decorative borders stay subtle                                                                                                                      |
| Theme class applied by a script, not React             | No flash on load, and no conflict when switching between system and an explicit theme                                                                                                |
| Theme cookie readable by JavaScript                    | Not sensitive; lets the browser switch theme with no request                                                                                                                         |
| Language prefix validated in `params.parse`            | Child routes get a typed language; unknown prefixes become a 404                                                                                                                     |
| One `@types/react` version (pnpm `overrides`)          | Strapi's React 18 types were hoisted where TanStack Router found them. A `packageExtensions` peer was tried first and split the router into two runtime copies, breaking every link. |
| One `NAV_ITEMS` list                                   | Header and mobile menu stay in sync; typed links fail to compile for pages that don't exist yet                                                                                      |
| Layout data in the root `beforeLoad`                   | Every page needs it, including 404s outside `$lang`; cached queries make repeat navigations free                                                                                     |
| Explicit Zod env modules instead of `@t3-oss/env-core` | The template's setup read server variables from `import.meta.env`, where they don't exist, and evaluated at module level                                                             |
| Social links open in the same tab, with `rel="me"`     | New tabs without warning hurt accessibility (WCAG G201); `rel="me"` marks the profiles as the owner's                                                                                |
| Default favicon in `public/favicon.svg`                | Used until one is uploaded in the CMS site settings                                                                                                                                  |
| Project filters run in the browser                     | A handful of projects: one request loads them all, and filtering needs no round trip. Revisit if the list grows past what one page should load.                                      |
| Filters in the URL, ignored when invalid               | Shareable, back-button friendly; a typo in a link never breaks the page                                                                                                              |
