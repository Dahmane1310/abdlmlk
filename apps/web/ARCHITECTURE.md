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
| Markdown and code                    | Rendered to HTML on the server (unified), highlighted by Shiki  |

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
    home/  about/  profile/  career/  services/  testimonials/  technologies/
    blog/  comments/  newsletter/  contact/
                               A page feature (home/, about/) composes other features' components;
                               career/ owns the experience timeline and education cards that the About page
                               (and later the home page) shows. technologies/ owns the skills grid, the shared
                               technology schema and the server-only logo lookup (technology-icon.server.ts).

  components/
    ui/                        shadcn components, generated then adapted to our design
    layout/                    site shell, shared by every page:
                               site-layout (skip link + header + <main> + footer), site-header, site-footer,
                               mobile-menu, nav-items (the one list of nav links), language-switcher,
                               language-link, theme-toggle, container (page width), not-found-page,
                               error-page (CMS unreachable; dictionaries only, no CMS data),
                               and the page anatomy: page, page-header, page-section (see "Page anatomy")
    content/                   shared content display: content-blocks (CMS blocks), facts-strip (key facts),
                               metric-grid (figures with labels), meta-line ("A · B · C" facts),
                               tech-list (technology chips), responsive-image

  lib/
    strapi/
      client.server.ts         Strapi SDK client (server only), built per request from the environment
      public-api.ts            browser calls to Strapi's public form endpoints (forms step)
      schemas.ts               shared Zod schemas: media (absolute URL + srcset), SEO, the { data } wrapper
      media.ts                 absolute URLs for uploads
    content/
      blocks.schema.ts         Zod schema for the CMS content blocks (a dynamic zone) + the query to populate them
      blocks.server.ts         blocks → render-ready data: Markdown and code turned into HTML, empty blocks dropped
    i18n/
      config.ts                supported languages, default, text direction, language cookie
      negotiate.ts             picks a language from the browser's Accept-Language header
      language.functions.ts    server function: the visitor's preferred language, for the "/" redirect
      use-language.ts          hook: current page's language, for components outside /$lang route files
      use-translation.ts       hook: the current language's dictionary
      dictionaries/            en.ts (reference shape), ar.ts, fr.ts
      format.ts                dates via Intl: month + year, date ranges ("Apr 2023 — Present"),
                               durations ("2 years 5 months")
    markdown/
      render.server.ts         Markdown → safe HTML, code highlighted (table of contents comes with the blog)
    theme/
      config.ts                themes (light, dark, system), default, cookie
      theme.ts                 read the cookie (server and browser), save a choice
      theme-script.ts          inline <head> script: applies the theme before first paint
    cookies.ts                 read and write preference cookies in the browser (theme, language)
    initials.ts                "PM" from "Pharmacy Management System", for placeholders and logo tiles
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
  - **Keep layout data small:** it's sent with every page. The profile is split in two: `profileQuery` (name, headline, socials… for the layout and home) and `profileDetailsQuery` (bio, photo, spoken languages), which only the About page loads.
- **If the CMS is unreachable,** the root `errorComponent` shows a translated error page (status 500) with a "Try again" button that re-runs the loaders. It only uses the dictionaries, since CMS data is exactly what's missing. Error details show in development only.
- **Missing content** (an unknown slug) makes the server function throw `notFound()`, which renders the 404 page.
- **404s always show the site layout,** with a real 404 status:
  - An unknown page under a valid language (`/en/nope`) is caught by the `$lang` route, inside its layout.
  - An unknown language (`/de`) fails inside `$lang` itself, so its layout never renders. That `notFound()` targets the root route (`routeId: rootRouteId`), whose 404 wraps the page in the layout.
  - Missing content (`/en/projects/nope`) is thrown from a page's loader. It's caught by the nearest route with a `notFoundComponent`, which renders **in place of that route's component**. So every route whose loader can throw it sets `notFoundComponent: NotFoundPage` itself; left to `$lang`, the 404 would replace the whole layout.

## Rich content (Markdown and blocks)

Projects and blog posts are built from **content blocks** in the CMS (a Strapi dynamic zone): Markdown text, quotes, images, galleries, code and callouts.

```
Strapi blocks ──► blocks.schema.ts (Zod) ──► blocks.server.ts ──► <ContentBlocks>
                  one schema per block type   Markdown and code       one switch over the
                                              → HTML, on the server   block types
```

- **Everything is rendered on the server.** Components receive finished HTML, so the browser never downloads a Markdown parser or a highlighter. Server functions return blocks as a typed union (`type: 'rich-text' | 'quote' | …`), and `ContentBlocks` handles each type; TypeScript fails the build if a type is missing.
- **The Markdown pipeline** (`lib/markdown/render.server.ts`): remark-parse → remark-gfm (tables, task lists) → remark-rehype → rehype-sanitize → Shiki → HTML.
  - **Raw HTML in the Markdown is dropped,** and rehype-sanitize removes unsafe URLs (`javascript:`) and attributes. The CMS is ours, but a stolen editor account shouldn't be able to put scripts on the site.
  - **Shiki runs after sanitizing,** because sanitizing would strip its colours. Everything Shiki adds is generated by us, not taken from the content.
  - **`dangerouslySetInnerHTML` is used only for HTML from this pipeline.**
- **Code highlighting:** one Shiki highlighter per server, created on first use, with a fixed list of languages; an unknown language shows as plain text instead of failing. Light and dark colours are both written into the HTML as CSS variables, and `app.css` picks one from the `.dark` class, so code switches theme instantly with the rest of the page. Code blocks are always `dir="ltr"`, also on Arabic pages.
- **Populating blocks:** Strapi only returns a block's images when asked. `CONTENT_BLOCKS_POPULATE` asks per block type (`on` fragments), so each type fetches only its own media.
- **Text styling:** Markdown output uses Tailwind Typography (`prose`), with its colours mapped to the design tokens in `app.css`.
- **Single Markdown fields** (the bio, a job's achievements, a degree's description) go through the same pipeline in their server function and come back as a `…Html` field (`bioHtml`), so the name says it's ready to render. Empty fields come back as `null`.

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

## Page anatomy

Every page is built from the same pieces, so home, about and projects feel like one site. New pages use them instead of their own header or section markup.

```
<Page>                          frame: site width, space above and below, gap between blocks
  <PageHeader
    eyebrow    small label above the title: "About", "Selected work", "← All projects",
               "● Open to work · Tlemcen, Algeria"
    title      the h1, one size on every page (home included)
    subtitle   optional mono line in the accent colour (a person's headline)
    lead       optional one or two sentences
    media      optional, at the end of the title row (the photo)
  >
    facts strip, buttons, filters
  </PageHeader>
  <PageSection title="Experience">   "01 Experience ───────", then the content
  …
</Page>
```

- **Labels** use the `mono-label` utility (`app.css`): mono, small, uppercase, letter-spaced, muted. That covers the label above the title, fact labels, filter labels and side-panel titles. Arabic labels use the sans font with normal spacing: Arabic has no capitals, and Plex Mono's space is far too wide between Arabic words.
- **Key facts** go in a `FactsStrip`: on About, the current job, location, start year and status; on project pages, the type, client or university, role and dates. **Headline numbers** go in a `MetricGrid`. Both are bordered grids drawn with 1px gaps.
- **Section numbers** come from a CSS counter on `<main>`, shared by `.section-title` (`PageSection`) and Markdown h2s, so a case study's own headings count along with the page's sections. `content: … / ""` keeps the numbers out of what screen readers announce. Side-panel titles (Tech stack) use `mono-label` instead and aren't counted.
- **Availability** is always the short status, "● Open to work" (`AvailabilityStatus`). The CMS note ("Open to remote roles and freelance projects.") is shown under it in the About facts strip.

## Styling and UI

- **Design:** modern and techy, flat. 1px borders, high contrast, one accent colour (electric blue), monospace for details (dates, labels, numbers). No gradients, glows or decorative shadows.
- **Design tokens** (colours, fonts, radius) are CSS variables in `styles/app.css`, exposed to Tailwind as `bg-primary`, `text-muted-foreground`, `border-input` and so on. Components use tokens, never raw colour values. Names follow shadcn's convention:
  - `primary` is the brand colour (electric blue): links, main buttons, focus ring.
  - `accent` is shadcn's subtle **hover background**, not the brand colour.
  - `border` is for decorative lines (cards, dividers); `input` is the stronger border for form controls.
  - `warning` (amber) tints warning callouts, so they read apart from `destructive` red. It's only used for borders and backgrounds, never for text.
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
  - **`sizes` must match the real layout width,** or the browser downloads a bigger file than it shows. Page content is at most `61rem` wide (the `64rem` container minus its padding) and the reading column `48rem`.
- **Missing images never show as broken.** Project cards show the project's initials until a cover is uploaded; Arabic initials are joined with a zero-width non-joiner, so they stay separate letters instead of joining into a word. The project page shows its cover only when there is one: the title right above already says what the project is.
- **Reading width:** long-form content (Markdown, blocks) is capped at `max-w-3xl` (48rem) for a comfortable line length.
- **Grids with content use `grid-cols-1`** (`minmax(0, 1fr)`) rather than an implicit column. A grid column otherwise grows to fit its widest content, and one long code line would make the page wider than a phone screen instead of scrolling inside its code block.
- **Whole-card links:** a project card is clickable everywhere through its title link, whose `::after` covers the card (a "stretched link"). Screen readers hear one link per card, not a link wrapping the whole card's text. Other links inside the card (Visit site) sit above it with `relative z-10`, and the card shows the focus ring when its title link has keyboard focus (`has-[a:focus-visible]`).
- **The accent colour marks what's current or measured,** never decoration: the current job's timeline marker and badge, filled steps of a language meter, achievement bullets.
- **Visual-only indicators are hidden from screen readers** when the same information is written out next to them: language meters (the level is written below), organization initials tiles (the name is next to them).
- **Durations that depend on today** (how long a job has lasted) are computed in the server function, not in the component. The server render and the browser then agree, so the page can't flip between two values on hydration.
- **Technology logos:** the CMS stores a Simple Icons slug per technology ("nodedotjs"). Server functions swap it for the logo's SVG path with `withIconPath`, so the browser gets the shape and never the icon library (the `simple-icons` package is only imported in a `.server.ts` file).
  - **One colour:** logos use the text colour (`fill-current`), so they fit the one-accent design and switch with the theme. They're decorative (`aria-hidden`): the name is always next to them.
  - **The same chip everywhere:** `TechList` shows logo and name on the About skills, the timeline, project cards and project pages. An unknown or missing slug shows the name only (Convex has no logo in Simple Icons).
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
- **Types come from Zod** (`z.infer`), never hand-written copies of the same shape. When a server function reshapes the data (rendered HTML, logo paths, durations), components take their type from the function's return type instead (`ProjectSummary`, `Career`, `SkillGroup`).
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
| Content blocks rendered to HTML on the server          | The browser gets finished HTML: no parser or highlighter download, and one place to sanitize                                                                                         |
| `@shikijs/rehype` for code in Markdown                 | Shiki's official plugin; replaced a hand-written one that needed type casts. Reuses the same highlighter as code blocks.                                                             |
| Sanitize, then highlight                               | Sanitizing removes unsafe content; running it after Shiki would also strip the colours                                                                                               |
| `notFoundComponent` on routes whose loader can 404     | A loader's `notFound()` replaces the component of the route that catches it; caught by `$lang`, it would drop the header and footer                                                  |
| Stretched-link project cards                           | The whole card is clickable, while screen readers get one short link instead of the whole card read as a link                                                                        |
| Amber `warning` token                                  | Warning and danger callouts looked the same in red                                                                                                                                   |
| Profile split into layout and About queries            | The bio and spoken languages would otherwise be sent with every page                                                                                                                 |
| About page: facts strip + timeline                     | Owner found the first version too plain and chose this direction (over a bento grid and an editorial layout): structure and accent colour without gradients or glows                 |
| Facts strip under the name, not a side card            | A short side card next to a long bio left a large empty gap and repeated the bio; a full-width strip is scannable and leaves no gaps. Owner's choice.                                |
| Experience as a vertical timeline, education as cards  | Jobs are a sequence, with one current; degrees are two self-contained items. The home page timeline (step 5) reuses `Timeline`.                                                      |
| Photo beside the name, no placeholder                  | The name is the anchor; an empty placeholder would look like a missing image                                                                                                         |
| Availability as a short status everywhere              | The CMS note is a sentence; as a bordered pill it was too big. It now sits under the status in the About facts strip.                                                                |
| One page anatomy for every page                        | Owner wanted home, about and projects to feel like one site; they had drifted apart (four header patterns, three section-title styles, different spacing)                            |
| Section numbers from a CSS counter                     | Keeps numbers in order across `PageSection`s and CMS Markdown headings without counting in code; `content: … / ""` hides them from screen readers                                    |
| One title size, home included                          | Consistency over a bigger hero                                                                                                                                                       |
| Project metrics titled "Key numbers"                   | Case studies have their own "Results" heading; two sections with the same name read as a mistake                                                                                     |
| `simple-icons` for technology logos                    | Free (CC0), maintained, 3,000+ logos as SVG path data; covers 22 of the 23 technologies. Owner approved the dependency. Only loaded on the server.                                   |
| Logos in one colour, on every tech chip                | Owner's choice: brand colours would break the one-accent design; one chip style keeps the pages consistent                                                                           |
| Skills right after Experience                          | What someone scanning a portfolio looks for next, before education                                                                                                                   |
| Long unit names in durations                           | Intl's short forms are unclear in French ("5 m.")                                                                                                                                    |
