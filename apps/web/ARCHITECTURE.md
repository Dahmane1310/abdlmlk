# Web app architecture

How `apps/web` is built: the structure, the rules and the reasons behind them. Every change follows this document. When a decision changes, this document changes in the same step. How the site **looks** (the approved visual design, its patterns and the content map) is in [`DESIGN.md`](./DESIGN.md).

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
    sitemap[.]xml.ts           /sitemap.xml, and robots[.]txt.ts /robots.txt: files the server answers (SEO)
    $lang/
      route.tsx                validates the language, renders header and footer
      index.tsx                home
      about.tsx
      contact.tsx
      projects/index.tsx, projects/$slug.tsx
      blog/index.tsx, blog/$slug.tsx, blog/series/$slug.tsx
      rss[.]xml.ts             /en/rss.xml…: the blog's RSS feed, a file the server answers, not a page

  features/                    one folder per domain, everything about it in one place
    projects/
      projects.schema.ts       Zod schemas for CMS data + the inferred types
      projects.functions.ts    server functions that read from Strapi
      projects.queries.ts      TanStack Query options (keys + fetchers)
      components/              UI used only by this feature
    home/  about/  profile/  career/  services/  testimonials/  technologies/
    blog/  likes/  comments/  newsletter/  contact/
                               A page feature (home/, about/) composes other features' components;
                               career/ owns the experience and education rows that About shows, and
                               Home's short version of the jobs (ExperienceList brief). technologies/ owns the skills list, the shared
                               technology schema and the server-only logo lookup (technology-icon.server.ts).
                               services/ owns the "What I do" list and its icon map (service-icon.tsx).
                               blog/ owns articles, tags and series: the list, the topic filter, the
                               article page with its contents, progress bar, share links and series
                               card, the series page, and the reading time (reading-time.ts).
                               likes/ owns the like button: the count and the reader's own like
                               (stored-like.ts). comments/ owns an article's responses: reading them,
                               grouped into threads (threads.ts), the link to them and the form.
                               newsletter/ owns the sign-up box and the note Home shows after a
                               link from a newsletter email (?newsletter=).

  components/
    ui/                        shadcn components, generated then adapted to our design
    layout/                    site shell, shared by every page:
                               site-layout (skip link + header + <main> + footer), site-header, site-footer,
                               mobile-menu, nav-items (the one list of nav links), language-switcher,
                               language-link, theme-toggle, container (page width), not-found-page,
                               error-page (CMS unreachable; dictionaries only, no CMS data),
                               and the page anatomy: page, page-header, page-section, contact-band
                               (see "Page anatomy")
    content/                   shared content display: content-blocks (CMS blocks), facts-strip (key facts),
                               metric-grid (figures with labels), meta-line ("A · B · C" facts),
                               spec-list (label-column rows), tech-list (technology chips), responsive-image,
                               arrow-link (a router Link with an arrow, from createLink)

  lib/
    strapi/
      client.server.ts         Strapi SDK client (server only), built per request from the environment
      public-api.ts            postToStrapi(): browser posts to Strapi's public endpoints (likes, then the forms)
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
      render.server.ts         Markdown → safe HTML, code highlighted, headings with ids
      heading-ids.ts           gives h2s and h3s unique ids and lists the h2s, for an article's contents
    seo/
      page-head.ts             pageHead(): a page's title, description, canonical, hreflang and Open Graph tags
      sitemap.server.ts        the sitemap: every page in each of its languages, read from the CMS
      structured-data.ts       schema.org JSON-LD: the owner (Person), WebSite, ProfilePage, BlogPosting, breadcrumbs
    theme/
      config.ts                themes (light, dark, system), default, cookie
      theme.ts                 read the cookie (server and browser), save a choice
      theme-script.ts          inline <head> script: applies the theme before first paint
    cookies.ts                 read and write preference cookies in the browser (theme, language)
    initials.ts                "PM" from "Pharmacy Management System", for placeholders and logo tiles
    use-copy.ts                useCopy(): copies to the clipboard, "Copied" for two seconds (code blocks, share)
    xml.ts                     escapeXml(), for the RSS feeds and the sitemap
    utils.ts                   cn() class helper

  styles/
    app.css                    Tailwind, design tokens, fonts
  env.ts                       public environment variables (VITE_…), validated with Zod
  env.server.ts                server-only environment variables, read per request
  vite-env.d.ts                types for import.meta.env
  router.tsx                   router + Query client setup
  routeTree.gen.ts             generated by TanStack Router, never edited

public/
  favicon.svg                  until one is uploaded in the CMS
  share/                       en.png, ar.png, fr.png: the share cards, made from design/share-image.html
design/
  share-image.html             the share cards' source; its comment says how to remake the PNGs
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
  - **Keep layout data small:** it's sent with every page. The profile is split in two: `profileQuery` (name, headline, socials… for the layout and home) and `spokenLanguagesQuery`, which only the About page loads.
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
  - **Heading ids come last** (`heading-ids.ts`, only when asked for: articles), also after sanitizing, which would prefix them with `user-content-`. An id is the heading's text as a slug, in any script, so an Arabic heading gets an Arabic id. The caller passes one set of used ids for the whole article, so the same heading in two blocks still gets two ids (`-2`), and seeds it with the page's own ids (`contact`), so a heading can't take the navbar's Contact jump. The h2s come back with the HTML and become the article's `headings`.
  - **`dangerouslySetInnerHTML` is used only for HTML from this pipeline.**
- **Code highlighting:** one Shiki highlighter per server, created on first use, with a fixed list of languages; an unknown language shows as plain text instead of failing. Light and dark colours are both written into the HTML as CSS variables, and `app.css` picks one from the `.dark` class, so code switches theme instantly with the rest of the page. Code blocks are always `dir="ltr"`, also on Arabic pages.
- **Populating blocks:** Strapi only returns a block's images when asked. `CONTENT_BLOCKS_POPULATE` asks per block type (`on` fragments), so each type fetches only its own media.
- **Text styling:** Markdown output uses Tailwind Typography (`prose`), with its colours mapped to the design tokens in `app.css`.
- **Single Markdown fields** (a job's achievements, a degree's description) go through the same pipeline in their server function and come back as a `…Html` field (`achievementsHtml`), so the name says it's ready to render. Empty fields come back as `null`.

## Writing data (forms)

Likes, comments, newsletter and contact **post directly from the browser to Strapi's public endpoints**, through `postToStrapi()` in `lib/strapi/public-api.ts`, which checks the answer with the feature's Zod schema.

**Why:** Strapi's spam protection limits requests per visitor IP. Through our server, every visitor would share the server's IP, and one spammer could block everyone.

**Flow:** TanStack Form validates the input with the feature's Zod schema → a TanStack Query mutation sends it → the form shows the pending, error and success states. Strapi validates again; the client check exists for instant feedback, not for security.

- **The schema takes the dictionary's messages** (`commentFormSchema(t.comments.errors)`), so errors are in the page's language, and uses the CMS's own limits.
- **Errors show once a field is left or the form is sent,** not while typing; after a failed send, the focus moves to the first field to fix. Each error is tied to its control with `aria-invalid` and `aria-describedby`.
- **A refused request says why:** `postToStrapi()` throws a `StrapiRequestError` with the HTTP status, so the form can tell "too many" (429) and "closed" (403) from any other failure.
- **The honeypot** (`website`) is off screen and hidden from screen readers, with `tabIndex={-1}`: only bots fill it in, and the CMS's spam guard quietly drops what has it.

**The newsletter** (`features/newsletter/`) is double opt-in, run by the CMS:

- **Sign-up** posts the email and the page's language to `/api/newsletter/subscribe`, so the confirmation email comes in the reader's language. The CMS always answers "ok", whether or not the address was already on the list, so the list can't be probed; the form then asks the reader to check their inbox. Without email set up (locally), the CMS writes the confirmation link to its log instead.
- **Coming back:** the links in the CMS's emails confirm or unsubscribe, then send the reader to `/{lang}?newsletter=confirmed` or `?newsletter=unsubscribed` (or `/?newsletter=invalid` for a used or unknown link, where `/` keeps the parameter through its language redirect). Home validates `?newsletter=` with Zod, ignores anything else, and shows the matching note; closing it removes the parameter.
- **Sending new articles** to subscribers isn't built yet.

**RSS** (`routes/$lang/rss[.]xml.ts`, `features/blog/rss.server.ts`): one RSS 2.0 feed per language, answered by the route's `server.handlers.GET` instead of a page.

- **Summaries:** each article's title, link, date, topics and description; readers click through to the site. The XML is written by hand, with every CMS text escaped, so no package is needed. The feed is cached for an hour (`Cache-Control`).
- **Full links** start with `SITE_URL`, or the request's own address when it isn't set.
- **Found from any page:** the `$lang` layout's `head` adds `<link rel="alternate" type="application/rss+xml">` for its language; the newsletter box links to it as the other way to follow.
- **An unknown language is a 404:** Start runs the `$lang` layout's parameter check before the handler, and its "not found" (a 404 for pages) would otherwise answer a file route with a 500. A small request middleware on the route (`notFoundAs404`) turns it into a plain 404.

**Likes** (`features/likes/`) have no form:

- **A state, not a toggle.** The browser sends whether the reader likes the article (`liked: true | false`), and the CMS adds or removes that visitor's one entry. Sending the same answer twice changes nothing, so a double click or a retry can't count twice.
- **Shown at once, sent in order.** A click fills the heart and changes the cached total right away (`setQueryData`). The requests share a mutation `scope`, so TanStack Query sends them one at a time in click order, and only the last one's answer sets the total. If a request fails (rate limit, CMS down), the like is undone and the total fetched again.
- **The reader's like** lives in `localStorage` (`stored-like.ts`), read through `useSyncExternalStore`: the server renders "not liked" and the browser swaps in the stored answer after hydration, so they never disagree. It only fills the heart; the CMS keeps the real like per visitor.
- **The total is read through a server function** (`getLikes`), like all reads, in the browser after the page shows: articles are cached for good, the count isn't.

**Responses** (`features/comments/`) are read the same way: `getComments` asks Strapi for an article's approved responses in the page's language (a response belongs to the language it was written in) and groups them into threads one level deep (`threads.ts`): a reply to a reply joins its response's thread, and a reply whose response was since rejected is left out. The speech-bubble link beside the like button shares the same query for its count. A response is shown as plain text with its line breaks (`whitespace-pre-line`), never as HTML or Markdown, so a reader's text never needs sanitizing; `dir="auto"` lets it read in its own direction.

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

Every page is built from the same pieces, so home, about and projects feel like one site. New pages use them instead of their own header or section markup. They implement `DESIGN.md`'s page anatomy.

```
<Page header={                  frame: the header band full width, then the sections at the
                                site width with the same spacing and a full-width line
                                between them, then the contact band
                                (spacing="document" for About's tighter rhythm)
  <PageHeader                   the blueprint band (full width, grid behind, bottom border)
    eyebrow    small label above the title: "About", "Selected work", "← All projects",
               "● Open to work · Tlemcen, Algeria"
    title      the h1: one size on every page, size="hero" for Home's larger one
    subtitle   optional mono line in the accent colour (a person's headline)
    lead       optional one or two sentences (Home's intro, a project summary)
    strip      optional <FactsStrip /> or <MetricGrid />, shown in the solid transition
               band under the grid: the blueprint band holds text, the strip figures
  >
    buttons, filters
  </PageHeader>
}>
  <PageSection id="experience" title="Experience" action={<ArrowLink …>}>
                                     "01 Experience        Full story →", then the content;
                                     the section's id makes it a link target
  …
  (ContactBand, added by Page)       solid blue: contact headline, availability, Email me, LinkedIn
</Page>
```

- **Labels** use the `mono-label` utility (`app.css`): mono, small, uppercase, letter-spaced, muted. That covers the label above the title, fact labels, filter labels and side-panel titles. Arabic labels use the sans font with normal spacing: Arabic has no capitals, and Plex Mono's space is far too wide between Arabic words.
- **Every page passes something to `PageHeader`'s `strip`,** shown in the transition band: Home its headline numbers, About the CV at a glance, project pages their facts, Projects its filters. The page decides whether there is anything to show (`facts.length > 0`, `getFilterOptions` returning null), because the band would otherwise appear empty around a component that renders nothing.
- **Key facts** go in a `FactsStrip`: on project pages, the type, client or university, role and dates; on About, the CV at a glance (`useCvFacts`: total experience, current job, latest degree, spoken languages), worked out from the career data already on the page. **Headline numbers** go in a `MetricGrid`. Both are borderless strips (`components/content/strip.ts`), passed to `PageHeader` as `strip`: dividers between cells, two cells per row on phones (a line between the rows) and one row on large screens. The cell classes are written so no two rules compete for the same cell: in Tailwind's output `odd:` comes after `first:`, so an `odd:` rule silently beat the `first:` one.
- **The contact band** closes every page through `Page` (and the 404 page, which adds it itself), from the profile already loaded for the layout. On its blue background the usual blue focus ring would vanish, so its buttons use an outline in the text colour. Its id (`CONTACT_ID`) is the target of the header's "Contact" button, and `getContactLinks` decides for both whether there's anything to show, so the button never points at a band that isn't there.
- **The site header** is a three-column grid on large screens (`1fr auto 1fr`), so the links sit at the true centre of the bar whatever the name's or the buttons' width. Each link fills the header's height, so the current page's 2px line (`::after`) sits on the header's bottom edge. Below `lg` the links, language and theme move into the menu: at tablet widths they didn't fit beside the name and the "Contact" button.
- **Section numbers** come from a CSS counter on `<main>`, shared by `.section-title` (`PageSection`) and Markdown h2s, so a case study's own headings count along with the page's sections. `content: … / ""` keeps the numbers out of what screen readers announce.
- **A case study's own sections** get the page's spacing and full-width lines from the same `section-dividers` rule, through a `case-study` class on the project page's `ContentBlocks`: every Markdown h2 but the first gets the section gap above it and the line as its `::after` (its `::before` is the number). Writing it in CSS means any case study written in the CMS gets it, with no parsing of the Markdown.
- **Availability** is always the short status, "● Open to work" (`AvailabilityStatus`). The CMS note ("Open to remote roles and freelance projects.") is shown in the contact band.
- **About is the online CV:** a plain header like the Projects page's (label, title, one line, Download CV), then experience, skills, education and languages. Home is the one introduction, so About repeats none of it (no name, photo, bio or status).
- **Spec rows** (`components/content/spec-list.tsx`): `SpecList` and `SpecRow` give every About section the same label column and content edge. Sections pass their own label (dates, a category heading, a language) and content; they don't style the row themselves, so the sections can't drift apart. Rows are separated by space, not lines: `spacing="roomy"` for long entries (jobs, degrees), the default compact spacing for one-line rows. A job's or degree's organization line is shared too (`OrganizationLine`).
- **Bulleted lists in CMS text** (job achievements, every rich-text content block) use the `square-bullets` utility (`app.css`): small blue squares on the start edge, so they mirror in Arabic. Numbered lists keep their numbers.
- **Article typography** comes from a `reading` class on the article's `ContentBlocks` (`app.css`): serif text, headings without the section numbers, a large serif pull quote, and sans text in Arabic. It's plain CSS, not a Tailwind utility, because the section-title rules it overrides are unlayered too (unlayered CSS always beats Tailwind's layers). It only styles the article's own text blocks (`.reading > .prose`), so callouts keep their size.
- **Code blocks** carry their plain text next to the highlighted HTML (`code`), for the `CopyButton` (`components/content/copy-button.tsx`); it announces "Copied" to screen readers with `aria-live`. The blue site mark is one component (`SiteMark`), shared by the navbar and an article's byline.
- **An article's contents and progress bar** (`features/blog/components/`) measure on scroll, at most once a frame (`requestAnimationFrame`).
  - `TableOfContents` is a `<nav>` whose current link has `aria-current="location"`: the last heading that has passed the top quarter of the screen. Headings have a `scroll-margin-top`, so a link lands them below the sticky header.
  - `ReadingProgress` sets the bar's CSS `scale` directly instead of through React state, so scrolling never re-renders the article. It's `aria-hidden`: the scrollbar says the same.

## Styling and UI

- **Design:** modern and techy, flat. 1px borders, high contrast, one accent colour (electric blue), monospace for details (dates, labels, numbers). No gradients, glows or decorative shadows. The full visual design, approved from a mockup, is in `DESIGN.md`; pages built before it are moving over step by step (its last section).
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
- **Fonts** are self-hosted with Fontsource: IBM Plex Sans (variable, all weights in one file), IBM Plex Sans Arabic (Arabic characters only, downloaded only on pages with Arabic text), IBM Plex Mono, and IBM Plex Serif for article text (400, 400 italic, 600; downloaded only on article pages, the only place `font-serif` is used). Arabic gets a taller line height. Plex Mono has no Arabic letters, so the mono font list falls back to Plex Sans Arabic; without it, Arabic in mono text (labels, the site name) renders disconnected. Only load-bearing weights exist: Mono comes in 400 and 500, so mono text never uses `font-semibold`, which the browser would fake.
- **shadcn components** are generated into `components/ui/` and then ours to adapt. Features compose them; they don't restyle them ad hoc. After `shadcn add`, review every generated file:
  - **Imports:** shadcn 4.21+ rewrites `@/lib/utils` to an npm package named `cn` that it doesn't install. Change it back to `import { cn } from '@/lib/utils'`; we keep the local helper.
  - **Flat design:** remove decorative shadows (`shadow-*`) and raw colours (`bg-black/50` and similar) in favour of tokens.
  - **Language:** replace hardcoded English text (e.g. screen-reader labels) with props filled from the dictionaries, as `SheetContent`'s required `closeLabel` does.
  - **Next.js leftovers:** remove `"use client"`; it means nothing here and adds build warnings.
- **Images:** `ResponsiveImage` (`components/content/`) renders CMS images with a `srcset` built from Strapi's generated sizes (thumbnail, small, medium, large and the original), a `sizes` hint from the caller, explicit width and height to prevent layout shift, and lazy loading unless `priority`. Without alt text an image is decorative (`alt=""`).
  - **`sizes` must match the real layout width,** or the browser downloads a bigger file than it shows. Page content is at most `61rem` wide (the `64rem` container minus its padding) and the reading column `48rem`.
- **Missing images never show as broken.** Project covers sit in an "app window" frame (a bar with the site's address, or the slug), and until a screenshot is uploaded show the project's initials in blue on the blueprint grid; Arabic initials are joined with a zero-width non-joiner, so they stay separate letters instead of joining into a word. The project page shows its cover only when there is one: the title right above already says what the project is.
- **Reading width:** long-form content (Markdown, blocks) is capped at `max-w-3xl` (48rem) for a comfortable line length.
- **Grids with content use `grid-cols-1`** (`minmax(0, 1fr)`) rather than an implicit column. A grid column otherwise grows to fit its widest content, and one long code line would make the page wider than a phone screen instead of scrolling inside its code block.
- **Whole-card links:** a project card is clickable everywhere through its title link, whose `::after` covers the card (a "stretched link"). Screen readers hear one link per card, not a link wrapping the whole card's text. Other links inside the card (Visit site) sit above it with `relative z-10`, and the card shows the focus ring when its title link has keyboard focus (`has-[a:focus-visible]`). The featured card's "Read the case study →" is text, not a second link to the same page; it's hidden from screen readers, who already hear the title link. Card titles are h2 on the Projects page and h3 under a section title (`headingLevel`).
- **Featured projects** are the ones with the CMS's `featured` flag, in its `order`; Home shows the first four. Home reads them from the same `projectsQuery` as the Projects page, so going from one page to the other needs no new request. Home's jobs work the same way: `careerQuery` is About's, and the rows are About's `ExperienceList` with `brief` (the shared label column is `JobPeriod`).
- **The blog** reads every published article once (`articlesQuery`) and filters by topic in the browser, like the projects; the topic is in the URL (`?tag=`). The list's server function reads each article's blocks only to work out its reading time (`reading-time.ts`: about 230 words a minute, code counted like prose, at least one minute) and its place in its series ("Part 2 of 3"), then drops them. The article's own server function renders the blocks to HTML like a case study's, and reads its series' published parts already in order (a `sort` inside the `populate`), for "Part 2 of 3" and the parts card (`SeriesParts`). The card's links are plain router links: the router marks the part being read with `aria-current="page"`, which also draws its blue line. A **series page** reads only the series' title and description (`getSeries`); its parts are picked from the cached article list and put in part order, like the topic filter, so their reading times are worked out in one place. An article's route loads that list too, for **More to read**: `pickRelated` (`related-articles.ts`) leaves out the article and its series' parts, then sorts by shared topics, keeping the list's newest-first order for ties.
- **Phrases with numbers** ("6 min read", "Part 2 of 3") are functions in the dictionaries, so each language follows its own rules: Arabic says "دقيقة واحدة", "دقيقتين", "3 دقائق", "11 دقيقة". **A word under a number** (the blog's "3 articles") uses `pluralForm` (`lib/i18n/format.ts`): the dictionary lists the word's forms by plural category ("one", "two", "few", "many", "other") and `Intl.PluralRules` picks the right one, so Arabic gets مقال, مقالان, مقالات, مقالًا without hand-written rules.
- **The accent colour marks what's current or measured,** never decoration: the current job's badge, filled steps of a language meter, achievement bullets.
- **Visual-only indicators are hidden from screen readers** when the same information is written out next to them: language meters (the level is written beside them).
- **Durations that depend on today** (how long a job has lasted) are computed in the server function, not in the component. The server render and the browser then agree, so the page can't flip between two values on hydration.
- **Technology logos:** the CMS stores a Simple Icons slug per technology ("nodedotjs"). Server functions swap it for the logo's SVG path with `withIconPath`, so the browser gets the shape and never the icon library (the `simple-icons` package is only imported in a `.server.ts` file).
  - **One colour:** logos use the text colour (`fill-current`), so they fit the one-accent design and switch with the theme. They're decorative (`aria-hidden`): the name is always next to them.
  - **The same chip everywhere:** `TechList` shows logo and name, without a border (borders are for clickable things), on the About skills and jobs, project cards and project pages. `size="lg"` is the larger version for the skills rows; the default is the small mono one. An unknown or missing slug shows the name only (Convex has no logo in Simple Icons).
- **Service icons** are Lucide icons named in the CMS ("layout-dashboard"). `service-icon.tsx` maps the names in use to their components, so the browser only downloads those; a name missing from the map shows the service without an icon. Adding an icon in the CMS means adding it to the map.
- **Accessibility:** semantic HTML, every control reachable by keyboard, visible focus, labelled inputs, sufficient contrast, motion reduced when the visitor asks for it.

## SEO

- **One helper for every page** (`pageHead()` in `lib/seo/page-head.ts`). Every page route's `head` returns it, so no page can leave something out:
  - its title and description;
  - its **canonical** address, without the query string, so a filtered list (`?tag=`, `?type=`) counts as the list itself;
  - **hreflang** links to the same page in each language it exists in, plus `x-default` pointing to English;
  - **Open Graph** tags (title, description, address, type, language, site name, image) and `twitter:card`, which LinkedIn, X, WhatsApp and others read for a shared link's card.

  The root route keeps a default title and description for 404 pages.

- **The site's address** is loaded once by the root route (`getSiteUrl`, from `SITE_URL` or the request's forwarded host) and read by every `head` from the router context.
- **Only translations that exist:** an article, project or series asks Strapi for its `localizations`, and `languagesOf()` turns them into its list of languages. The fixed pages (Home, About, the lists) exist in all three.
- **The share image** is the page's own SEO share image, then its cover, then a default uploaded in the Site settings, then the site's card in the page's language (`public/share/{lang}.png`, 1200×630, alt text the Site settings title). So every page has one.
- **The share cards** are drawn once from `design/share-image.html` in the browser, with the site's fonts and dark theme, and saved as PNGs; remake them when the name or headline changes. Drawing an image per page on the server (satori) was ruled out: it doesn't shape Arabic text.
- **The sitemap** (`/sitemap.xml`, `lib/seo/sitemap.server.ts`) lists every page in each language it exists in, with the same hreflang alternates as the heads. Home, About and the two lists exist in all three languages; projects, articles and series are read from the CMS one language at a time (slugs and last-change dates only, following its pages of 100) and matched by their document id, shared by an entry's translations. Their `lastmod` is the CMS's `updatedAt`. Filtered lists, the feeds and `/` aren't pages of their own.
- **`/robots.txt`** allows everything and names the sitemap. It's a route rather than a file in `public/` because the sitemap's address comes from `SITE_URL`.
- **The site's address in files the server answers** (the feeds, the sitemap, robots.txt) comes from the same `getSiteUrl()` as the pages' heads, so a proxy's forwarded host counts everywhere.
- **One meta tag per name or property:** the router keeps only one of each across the page, so tags meant to repeat (`og:locale:alternate`, `article:tag`) aren't used. The hreflang links already name the other languages, and an article's topics go in its structured data.
- **Structured data** (`lib/seo/structured-data.ts`): schema.org JSON-LD, which Google reads to describe a page in its results. `pageHead()` takes it as a `structuredData` callback, handing it the page's canonical address and share image, so the two can't disagree.
  - **Home:** a `WebSite` and the owner as a `Person`: name, headline as job title, intro, location, and the social profiles as `sameAs`. The email stays out, away from spammers. The profile comes from the root route's context, which loads it for the layout anyway.
  - **About:** a `ProfilePage` about that `Person`.
  - **Articles:** a `BlogPosting` (title, description, dates, share image, language, author, and the topics as `keywords`).
  - **Breadcrumbs:** a `BreadcrumbList` (Home › Blog or Projects › the page) on articles, projects and series.
  - **Written as `head` scripts,** `<script type="application/ld+json">`, which the router treats as data. This version's `head` type has no `'script:ld+json'` meta entry, though the router supports it. A script's content goes into the page as is, so `<` is written as `<`: CMS text can never close the tag early.

## Server and security rules

- **Server-only files** end in `.server.ts` (or import `@tanstack/react-start/server-only`). The build refuses to put them in the browser bundle.
- **Server functions** validate their input with Zod (`.validator(schema)`) and use `GET` for reads.
- **Environment variables** are validated in `env.ts`. Server variables are read inside server functions, never at module level. Only `VITE_`-prefixed variables reach the browser, and they hold nothing secret.
  - `VITE_STRAPI_URL` (required, `env.ts`): Strapi's public URL, for images and form posts from the browser. Baked in at build time.
  - `STRAPI_URL` (optional, `env.server.ts`): how the server reaches Strapi. In production, Strapi's internal address on Dokploy's Docker network (set up in the deployment step). Falls back to `VITE_STRAPI_URL`.
  - `SITE_URL` (optional, `env.server.ts`): the site's public address, for full links (canonical and hreflang links, link previews, the RSS feeds, the sitemap and robots.txt). Without it, the address the request came in on; set it in production, where a proxy could report an internal one.
  - All three are listed in `.env.example`; copy it to `.env.local` for development.
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

| Decision                                                          | Why                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TanStack Start, Router and Query                                  | Already in place; type-safe routing, SSR and caching that work together                                                                                                                                                                                         |
| No global store                                                   | Every piece of state has a better home (see "Where state lives")                                                                                                                                                                                                |
| Forms post straight to Strapi                                     | Per-visitor spam limits need the visitor's real IP                                                                                                                                                                                                              |
| Zod at every boundary                                             | One schema gives runtime safety and the TypeScript type                                                                                                                                                                                                         |
| Markdown and Shiki on the server                                  | Smaller pages; the browser doesn't download a parser or highlighter                                                                                                                                                                                             |
| IBM Plex family                                                   | One type family for English, French and Arabic, with a matching mono                                                                                                                                                                                            |
| Typed dictionaries instead of an i18n library                     | Around 100 interface strings; TypeScript enforces complete translations                                                                                                                                                                                         |
| Arabic dates and numbers with Latin digits                        | Consistent with the CMS content                                                                                                                                                                                                                                 |
| `@/` as the only import alias                                     | Owner's preference; one alias instead of two                                                                                                                                                                                                                    |
| ESLint 10 + Prettier                                              | TanStack and accessibility lint rules catch real bugs; Prettier ends style debates. ESLint 9 is no longer supported.                                                                                                                                            |
| `eslint-plugin-jsx-a11y-x` for accessibility rules                | The original plugin is unmaintained and stuck on ESLint 9; the fork (es-tooling) is maintained and supports ESLint 10. Owner accepted its 0.x version.                                                                                                          |
| Deployed with Dokploy                                             | Owner's VPS setup: Docker containers behind Traefik, configured in the deployment step                                                                                                                                                                          |
| Electric blue accent, cool-tinted neutrals                        | Owner's choice; techy and high contrast without gradients                                                                                                                                                                                                       |
| Separate `input` border token                                     | Form controls need 3:1 contrast; decorative borders stay subtle                                                                                                                                                                                                 |
| Theme class applied by a script, not React                        | No flash on load, and no conflict when switching between system and an explicit theme                                                                                                                                                                           |
| Theme cookie readable by JavaScript                               | Not sensitive; lets the browser switch theme with no request                                                                                                                                                                                                    |
| Language prefix validated in `params.parse`                       | Child routes get a typed language; unknown prefixes become a 404                                                                                                                                                                                                |
| One `@types/react` version (pnpm `overrides`)                     | Strapi's React 18 types were hoisted where TanStack Router found them. A `packageExtensions` peer was tried first and split the router into two runtime copies, breaking every link.                                                                            |
| One `NAV_ITEMS` list                                              | Header and mobile menu stay in sync; typed links fail to compile for pages that don't exist yet                                                                                                                                                                 |
| Layout data in the root `beforeLoad`                              | Every page needs it, including 404s outside `$lang`; cached queries make repeat navigations free                                                                                                                                                                |
| Explicit Zod env modules instead of `@t3-oss/env-core`            | The template's setup read server variables from `import.meta.env`, where they don't exist, and evaluated at module level                                                                                                                                        |
| Social links open in the same tab, with `rel="me"`                | New tabs without warning hurt accessibility (WCAG G201); `rel="me"` marks the profiles as the owner's                                                                                                                                                           |
| Default favicon in `public/favicon.svg`                           | Used until one is uploaded in the CMS site settings                                                                                                                                                                                                             |
| Project filters run in the browser                                | A handful of projects: one request loads them all, and filtering needs no round trip. Revisit if the list grows past what one page should load.                                                                                                                 |
| Filters in the URL, ignored when invalid                          | Shareable, back-button friendly; a typo in a link never breaks the page                                                                                                                                                                                         |
| Content blocks rendered to HTML on the server                     | The browser gets finished HTML: no parser or highlighter download, and one place to sanitize                                                                                                                                                                    |
| `@shikijs/rehype` for code in Markdown                            | Shiki's official plugin; replaced a hand-written one that needed type casts. Reuses the same highlighter as code blocks.                                                                                                                                        |
| Sanitize, then highlight                                          | Sanitizing removes unsafe content; running it after Shiki would also strip the colours                                                                                                                                                                          |
| `notFoundComponent` on routes whose loader can 404                | A loader's `notFound()` replaces the component of the route that catches it; caught by `$lang`, it would drop the header and footer                                                                                                                             |
| Stretched-link project cards                                      | The whole card is clickable, while screen readers get one short link instead of the whole card read as a link                                                                                                                                                   |
| Amber `warning` token                                             | Warning and danger callouts looked the same in red                                                                                                                                                                                                              |
| Spoken languages in their own query                               | Only About shows them; in the layout query they'd be sent with every page                                                                                                                                                                                       |
| About as the online CV, with a plain header                       | Home already introduces the owner; About's own introduction (name, bio, facts, buttons) repeated it. Owner's choice: About shows the career for recruiters, Home stays short.                                                                                   |
| One spec-row layout for every About section                       | Owner's choice: the timeline, rows and language columns started content at three different edges and didn't read as a CV. One shared row keeps them aligned.                                                                                                    |
| Availability as a short status everywhere                         | The CMS note is a sentence; as a bordered pill it was too big. It's shown in the contact band instead.                                                                                                                                                          |
| One page anatomy for every page                                   | Owner wanted home, about and projects to feel like one site; they had drifted apart (four header patterns, three section-title styles, different spacing)                                                                                                       |
| Section numbers from a CSS counter                                | Keeps numbers in order across `PageSection`s and CMS Markdown headings without counting in code; `content: … / ""` hides them from screen readers                                                                                                               |
| One title size, one step larger on Home                           | Consistency, with the approved design's slightly larger home title (`size="hero"`)                                                                                                                                                                              |
| Project metrics titled "Key numbers"                              | Case studies have their own "Results" heading; two sections with the same name read as a mistake                                                                                                                                                                |
| `simple-icons` for technology logos                               | Free (CC0), maintained, 3,000+ logos as SVG path data; covers 22 of the 23 technologies. Owner approved the dependency. Only loaded on the server.                                                                                                              |
| Logos in one colour, on every tech chip                           | Owner's choice: brand colours would break the one-accent design; one chip style keeps the pages consistent                                                                                                                                                      |
| Skills right after Experience                                     | What someone scanning a portfolio looks for next, before education                                                                                                                                                                                              |
| Long unit names in durations                                      | Intl's short forms are unclear in French ("5 m.")                                                                                                                                                                                                               |
| A solid transition band on every page                             | Owner's choice: the figures get their own calm band between the grid and the page. Pages without one felt empty, so About got the CV at a glance and Projects its filters there.                                                                                |
| Project type filters as strip cells with counts                   | Owner found the bordered chips busy. Cells reuse the strip layout, so the band looks like the other pages', and the counts say how much work each type has before clicking.                                                                                     |
| No technology filter                                              | Owner's choice: few projects list their technologies, so it offered choices that each matched one project. Old `?tech=` links are ignored.                                                                                                                      |
| No company logos on jobs                                          | The approved design: the role and company read clearly without tiles, and the rows stay calm                                                                                                                                                                    |
| Tighter section spacing on About only                             | The online CV reads as one document; landing-page gaps made its short sections look empty. Other pages keep the standard rhythm.                                                                                                                                |
| Fewer lines: no row lines on About, no title rules                | Owner's choice: lines between rows and after section titles were too busy, and the first title's rule doubled the header band's bottom edge. Space and the blue numbers separate.                                                                               |
| Full-width lines between sections                                 | Owner's choice: they echo the header band's edge-to-edge border. Drawn with a box-shadow (`section-dividers` in `app.css`), which reaches the screen edges without widening the page.                                                                           |
| `ArrowLink` built with `createLink`                               | TanStack Router's way to style a link: it keeps Link's typed `to` and `params`, so a wrong route fails to compile                                                                                                                                               |
| Featured projects filtered from the full list                     | One cached request serves Home and the Projects page; a handful of projects doesn't justify a second query                                                                                                                                                      |
| Service icons from a small map in code                            | Five icons in use: a typed map keeps the browser bundle to those five. Any-icon-from-the-CMS would need server rendering for little gain.                                                                                                                       |
| Home's jobs are About's rows with `brief`                         | One component for both pages, so the jobs can't look different; the mockup's separate one-line rows would have been a second design for the same data                                                                                                           |
| Navbar as a "spec bar"                                            | Owner's choice: centred mono pages (no numbers), the blue mark and the 2px current-page line carry the site's look into the header, which was plain text before                                                                                                 |
| Header "Contact" jumps to the contact band                        | Every page already ends with the band (email and LinkedIn); a second contact form or mailto would duplicate it. The 404 page got the band so the button always has a target.                                                                                    |
| Tech stack as a project page section                              | Owner's choice: the side panel floated beside the case study; as a numbered section it reads like the rest of the page and shows the larger logos                                                                                                               |
| Case-study dividers in CSS, not by splitting content              | Splitting the Markdown at its h2s into sections would mean parsing CMS text; a CSS hook gets the same look for any case study                                                                                                                                   |
| Blog as a text-first feed, numbers in the band                    | Owner's choice, after Medium: titles and descriptions carry an article better than cards with mostly missing covers. A row of topic links in the band looked messy, so topics filter from each article instead.                                                 |
| Reading time worked out on the server                             | One place, no extra CMS field to keep in sync; the blocks are already fetched                                                                                                                                                                                   |
| IBM Plex Serif for article text                                   | Owner's choice for a Medium-like read; same family and maker as the other fonts. Owner approved the dependency (`@fontsource/ibm-plex-serif`).                                                                                                                  |
| Articles without section numbers or lines                         | Owner's choice: an article reads as one continuous text; pages keep their numbered sections                                                                                                                                                                     |
| Likes, one per reader, kept per hashed IP                         | Owner's choice: Medium's claps (up to 50 each) were built first and dropped for the plain like everyone knows. With no accounts, the CMS keeps one entry per visitor and article (the IP hashed, as for comments), so one like holds whatever the browser says. |
| One like count for an article's languages                         | Counted by the document id, which Strapi shares between locales: it's one article, translated                                                                                                                                                                   |
| No captcha on likes                                               | There's no form to show one in; one like per visitor and the rate limit bound what anyone can add                                                                                                                                                               |
| Responses as an open list, one level of replies                   | Owner's choice: nothing to click to read them, and readable on phones, where deeper nesting gets too narrow                                                                                                                                                     |
| Responses loaded in the browser                                   | The article stays cached for good and new approvals show without touching it. They're not in the first HTML; search engines that run JavaScript still see them.                                                                                                 |
| Responses as plain text                                           | A reader's text is never trusted: no HTML or Markdown means nothing to sanitize. Line breaks are kept.                                                                                                                                                          |
| `@tanstack/react-form` for forms                                  | Owner approved the dependency (1.33, stable). Field state, validation timing and submit handling without hand-written plumbing; the newsletter and contact forms will reuse it.                                                                                 |
| Readers respond to the article only, for now                      | Owner's choice: one form; the owner replies from the CMS (shown as "Author"). Reader-to-reader replies can come later.                                                                                                                                          |
| Share links as text, not brand logos                              | lucide's brand icons are deprecated and due to be removed, and `simple-icons` has no LinkedIn logo (and is server-only here). Mono text links match the code blocks' Copy button.                                                                               |
| Touch screens get the system share sheet                          | Owner's choice. The `pointer: coarse` media query picks the layout in CSS, so nothing changes after hydration; a browser without `navigator.share` copies the link instead.                                                                                     |
| Share links open in a new tab, and say so                         | The reader keeps the article open; screen readers hear "opens in a new tab" (WCAG G201), unlike the profile links, which stay in the same tab.                                                                                                                  |
| Newsletter box after the series card, as a bordered card          | Owner's choice: right after reading, before a possibly long discussion; a card like the series card keeps the contact band the page's one big blue block                                                                                                        |
| "More to read" picked from the cached article list                | The list is already cached for the blog page, so suggestions cost no request of their own after a visit there; scoring by shared topics, then date, needs no CMS feature. Owner's choice: at the very end, as compact rows.                                     |
| RSS feeds with summaries, one per language                        | Owner's choice: readers click through to the full article, with its code highlighting, likes and responses. Hand-written XML: a few lines, no package.                                                                                                          |
| `SITE_URL`, falling back to the request's address                 | Full links need the public address; locally the request's own is right, and production sets it. The SEO step (canonical links, sitemap) reuses it.                                                                                                              |
| One `pageHead()` for every page's SEO tags                        | The pages had drifted (titles only, some without descriptions); one helper gives each the same canonical, hreflang and Open Graph tags                                                                                                                          |
| Structured data for the owner, articles and breadcrumbs           | Google can show breadcrumbs and article details in results and tie the social profiles to the site. Owner's choice: breadcrumbs on articles, projects and series.                                                                                               |
| Sitemap built from the CMS on request, not at build time          | Publishing an article must reach search engines without a rebuild; the answer is cached for an hour                                                                                                                                                             |
| One designed share card per language, drawn once                  | Owner's choice (the dark one). No page had an image to share; drawn in the browser, Arabic renders properly, with no package, where per-page images from satori would break Arabic text                                                                         |
| hreflang only to translations that exist                          | A link to a missing translation is a 404 that search engines flag; Strapi's `localizations` say which ones exist                                                                                                                                                |
| Canonical addresses without the query string                      | A topic or type filter shows part of the same list; counting each filter as its own page would split it in search results                                                                                                                                       |
| Navbar links ignore the search part when marking the current page | `includeSearch: false`: with `exact`, the router also compared "?…", so Home lost its blue line when it had `?newsletter=`                                                                                                                                      |
| Heading ids from our own step, not `rehype-slug`                  | `rehype-slug` starts over in every block, so two blocks could give the same id, and it doesn't return the headings for the contents. A few lines over the tree the pipeline already builds do both. Owner approved `@types/hast` (types only) for it.           |
| Contents on wide screens only                                     | Beside the text there's room; on a phone it would push the article down a screen before the first line                                                                                                                                                          |
| A series' parts in one card after the text                        | Owner's choice: the whole series and the next part in one place, on phones too. Previous / Next cards alone gave no overview; a second card before the text would push the article down.                                                                        |
| A series page's parts from the article list                       | The list already has each article's reading time and is usually cached from the blog page; fetching the parts with the series would mean a second copy of that work                                                                                             |
| Topics filter the list, no topic pages                            | Owner's choice: `?tag=` already gives a topic its own list and address, and topics have only a name in the CMS, so a page of their own would repeat the list                                                                                                    |
