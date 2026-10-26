# Design

The approved visual design for the whole site. Every page is built from it; when the design changes, this document changes in the same step. `ARCHITECTURE.md` covers how the code is organized; this file covers how the site looks.

**Status:** approved by the owner on 2026-10-25, from a mockup of the Home and About pages. The mockup's source is in `design/mockup/` (`home.dc.html`, `about.dc.html`): a frozen reference with the exact sizes and spacing. It was written for a design canvas, so it doesn't open as a normal web page; read it for values, and build the real pages in `src/`. One change since: on 2026-10-26 the owner made About the online CV, so the mockup's About page no longer applies: its header (statement title, photo, facts, bio) became a plain header, and its timeline and language columns became spec rows (see "About header" and "Spec rows").

## Principles

1. **Flat and techy, one accent.** Electric blue on cool neutrals, IBM Plex Sans and Mono. No gradients, glows, shadows or decorative colour.
2. **Two loud moments per page, no more.** Every page opens on the **blueprint band** (a faint blue grid behind the page header) and ends with the **contact band** (solid blue). Everything between is calm.
3. **Borders mean "clickable".** Only cards you can click (projects) have a border. Information (numbers, facts, services, skills, education, languages) sits in borderless rows, separated by thin lines or, on About, by space alone.
4. **Black text for content, grey for metadata.** Body text and titles use the foreground colour. Grey (`muted-foreground`) is only for dates, captions, labels and secondary details.
5. **Mono for labels and data only.** Plex Mono is for small uppercase labels, dates, durations, numbers, addresses and code. Everything else is Plex Sans.
6. **Each fact lives in one place.** A number, a description or a detail appears once per page, and site-wide where possible (see "Content map").

## Tokens

The colour tokens are the CSS variables in `src/styles/app.css` (light and dark), unchanged by this design. Additions and conventions:

| Token / value                                           | Use                                             |
| ------------------------------------------------------- | ----------------------------------------------- |
| Grid line: `primary` at 7% (light) / 10% (dark) opacity | The blueprint band's 32px grid                  |
| `muted`                                                 | The transition band under the blueprint band    |
| `on-primary` (`primary-foreground`)                     | Text and buttons on the solid blue contact band |
| Radius 6px                                              | Buttons                                         |
| Radius 12px                                             | Cards                                           |
| Radius 16px                                             | Contact band                                    |
| 1px lines in `border`                                   | Every divider and card border                   |

**Layout:** content width 1024px plus a 24px gutter on each side (`Container`). Pages are fluid below that: grids use `repeat(auto-fit, minmax(…, 1fr))` and rows wrap on phones.

**Type scale:**

| Element            | Style                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Page title (h1)    | Plex Sans 600, `clamp(44px, 7vw, 84px)` on Home, `clamp(40px, 6vw, 72px)` elsewhere, letter-spacing −0.035em, line-height ≈1.02 |
| Subtitle           | Plex Mono 18px in `primary` (e.g. "Full-Stack Engineer")                                                                        |
| Lead paragraph     | 20–22px, foreground                                                                                                             |
| Section title (h2) | 28px 600, letter-spacing −0.02em                                                                                                |
| Card title (h3)    | 20px 600 (30px on the wide featured card)                                                                                       |
| Body               | 16–17px, line-height 1.6                                                                                                        |
| Secondary text     | 15px, `muted-foreground`                                                                                                        |
| Label              | Plex Mono 12px, uppercase, letter-spacing 0.06em, `muted-foreground`                                                            |
| Meta / dates       | Plex Mono 12–13px, `muted-foreground`                                                                                           |
| Big numbers        | Plex Mono 500, 36px, letter-spacing −0.02em                                                                                     |

**Spacing:** header band padding 96px on top; 112–128px between sections; 40px from a section title to its content. About is the one exception, with 80px between sections: it's the online CV and reads as one document (owner's choice).

## Page anatomy

```
Site header        logo (mono) · Home · About · Projects        language · theme
Blueprint band     label (mono, uppercase)
                   page title
                   subtitle (mono, blue) and/or lead text (Home's intro, a project summary)
                   buttons or filters
Transition band    solid, under the grid, on every page: numbers (Home), facts (About, project pages)
                   or the filters (Projects)
Sections           "01  Title                       optional link"
                   content
                   ─────────── full-width line, midway between two sections ───────────
Contact band       solid blue: "Contact" label, headline, availability line, Email me + LinkedIn
Site footer        © · LinkedIn GitHub · English العربية Français
```

## Patterns

- **Blueprint band:** a full-width area behind the page header with a 32px grid of 1px lines in the grid colour, closed by a 1px bottom border. Plain flat lines, not a gradient effect.
- **Transition band and strip:** on every page, a full-width band in solid `muted` sits between the blueprint band and the plain page, closed by a 1px bottom border, so the page steps from grid to tint to plain (owner's choice; the mockup had the strip inside the grid, and pages without one felt empty). The blueprint band holds text and buttons; the transition band holds the page's figures or controls. Figures go in a strip: a row of cells with 1px vertical lines between them and the first cell flush with the text, two cells per row on phones (with a 1px line between the rows).
  - **Home:** the headline numbers (big mono number above a grey caption).
  - **About:** the CV at a glance (see "About header").
  - **Project pages:** the project's facts (mono label above a value, with an optional grey second line).
  - **Projects:** the filters, the page's controls (see "Projects filters").
- **Projects filters:** the types as a strip: one cell per type (and "All"), a mono label above its project count (36px mono, like Home's numbers), the whole cell a link. The chosen cell's label and count turn `primary`, with a 2px `primary` line along its bottom edge; the others keep a black count and a grey label. Type is the only filter: the owner removed the technology filter (few projects list their technologies). No bordered chips (owner found them busy). Each cell is a link, so each filtered view has its own shareable address.
- **Section title:** a mono number in `primary` ("01", hidden from screen readers), the title, and an optional link at the end of the row ("All projects", "Full story"). No line after the title: right under the header band it doubled the band's bottom edge (owner's choice). Numbers count the sections shown on the page.
- **Section divider:** a 1px line in `border`, running edge to edge like the header band's bottom edge, midway between two sections. None above the first section (the band's edge is there) and none above the contact band (the blue card separates itself). Owner's choice, so the page reads as a stack of full-width bands.
- **Project card:** bordered and rounded (12px) on `card`; the border darkens to `input` on hover. Top: the cover. Body: meta (type · year, mono), title, summary (grey), technologies, "Visit site ↗".
  - **Featured card:** the first of Home's four featured projects (the CMS's "featured" flag, in its order) is wide: the cover on one side (about 60%), a larger body on the other (30px title), ending with "Read the case study →". On phones the cover goes on top. The other three are normal cards in a row.
  - **Cover placeholder** (until a screenshot is uploaded): an "app window" bar (three small squares, then the project's address or slug in mono) over the blueprint grid on `muted`, with the project's initials large in mono `primary` (48px on cards, 88px on the featured card).
- **Technologies:** logo (one colour, `currentColor`) then the name, with no border, in rows with generous gaps.
- **Services ("What I do"):** the services marked "featured" in the CMS, in its order, as a borderless grid (3 columns, 2 on tablets, 1 on phones) separated by space: a Lucide icon in `primary` (24px, stroke 1.75) with a mono index ("01") at the other end, the title (18px 600) and a grey summary. The mockup's 1px line above each item was left out, after the owner found the About rows' lines too busy.
- **Experience summary (Home):** About's spec rows, shortened: the dates, duration and "Current" badge in the label column, then the role and company · work mode · place. No summary, achievements or technologies; the section title ends with "Full story →" to About. (The mockup had one-line rows with lines; they became About's rows so both pages show jobs the same way.)
- **About header:** the same plain header as Projects: the label, a factual title ("Experience & skills"), one line, and "Download CV". No name, photo, bio, status or Email me: Home introduces the owner, so About doesn't do it a second time (owner's choice). Its transition band sums the CV up at a glance, as facts: total experience (the jobs' durations added up), the current role and company, the latest degree and field, and the spoken languages. All of it comes from the sections below; nothing is typed in twice.
- **Spec rows (About):** every About section uses the same rows, so all their content starts at the same edge and the page reads as one document (owner's choice, replacing the mockup's timeline and language columns). Each row has a 180px label column (dates in mono, or a mono label) and the content beside it, baseline-aligned. Rows are separated by space, not lines (the owner found row lines too busy; the label column already marks each row): 48px between jobs and degrees, 20px between skills and languages. On phones the label sits above the content.
  - **Experience:** label: period, duration and a "Current" badge (1px blue border, blue mono text) on the current job. Content: role (20px 600), company (a blue link when it has a website) · work mode · place in grey, summary, achievements with small square blue bullets, technologies.
  - **Skills:** label: the category. Content: the technologies.
  - **Education:** label: the period. Content: degree and field (20px 600), the school and place like a job's, and a short grey description.
  - **Languages:** label: the language. Content: the level in words, a five-step meter (filled steps in `primary`, the rest in `border`) and the CEFR level in mono, at fixed widths so the meters line up.
- **Contact band:** solid `primary`, text in `on-primary`, radius 16px, 56px padding. A white (`on-primary`) "Email me" button with blue text, and an outlined "LinkedIn ↗".
- **Buttons:** 44px tall (48px on the contact band), radius 6px. Primary: solid blue. Secondary: 1px `input` border. Text links with an arrow, pointing the reading way (left in Arabic): "See my work →" in Home's header (jumps to Selected work), and "All projects →" / "Full story →" at the end of a section title.

## Content map

| Page         | Says                                                                                                                                                 | Doesn't repeat                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Home         | Who (name, headline, pitch), proof (the headline numbers), selected work (featured projects), what I do (services), experience in two lines, contact | Full job details, education, skills                                                       |
| About        | The online CV: a plain header with Download CV, the CV at a glance, jobs with achievements, skills, education, languages, contact                    | Who I am (name, photo, bio, status, location), the headline numbers, project descriptions |
| Projects     | The full list with filters                                                                                                                           |                                                                                           |
| Project page | The case study                                                                                                                                       |                                                                                           |

Copy introduced with the design (editable, in the dictionaries): the contact headline "Have a project in mind? Let's build it.", and the About title "Experience & skills" with its line "The jobs, tools and studies behind my work."

## Arabic

Everything mirrors with logical CSS (start/end): the spec rows' label column, the square bullets, strip dividers and the section titles' end links move to the right. Labels in Arabic use the sans font with normal spacing (see `mono-label` in `ARCHITECTURE.md`).

## Moving the current pages to this design

The pages built so far predate this design. They move over step by step:

1. **Shared pieces** (done): the blueprint band in `PageHeader`, the transition band on every page (numbers, facts or filters), 28px section titles, the contact band (added by `Page`, so 404 and error pages don't get it), technology chips without borders, the branded cover placeholder, and black body text.
2. **Home** (done): featured work with "See my work" and the section titles' end link, "What I do", and the experience summary (this replaced the planned step 5).
3. **About** (done): the online CV with a plain header, then experience, skills, education and languages as spec rows.
4. **Projects and project page:** cards and covers in the new style.
