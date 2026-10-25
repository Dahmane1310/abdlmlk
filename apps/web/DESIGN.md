# Design

The approved visual design for the whole site. Every page is built from it; when the design changes, this document changes in the same step. `ARCHITECTURE.md` covers how the code is organized; this file covers how the site looks.

**Status:** approved by the owner on 2026-10-25, from a mockup of the Home and About pages. The mockup's source is in `design/mockup/` (`home.dc.html`, `about.dc.html`): a frozen reference with the exact sizes and spacing. It was written for a design canvas, so it doesn't open as a normal web page; read it for values, and build the real pages in `src/`.

## Principles

1. **Flat and techy, one accent.** Electric blue on cool neutrals, IBM Plex Sans and Mono. No gradients, glows, shadows or decorative colour.
2. **Two loud moments per page, no more.** Every page opens on the **blueprint band** (a faint blue grid behind the page header) and ends with the **contact band** (solid blue). Everything between is calm.
3. **Borders mean "clickable".** Only cards you can click (projects) have a border. Information (numbers, facts, services, skills, education, languages) sits in borderless rows separated by thin lines.
4. **Black text for content, grey for metadata.** Body text and titles use the foreground colour. Grey (`muted-foreground`) is only for dates, captions, labels and secondary details.
5. **Mono for labels and data only.** Plex Mono is for small uppercase labels, dates, durations, numbers, addresses and code. Everything else is Plex Sans.
6. **Each fact lives in one place.** A number, a description or a detail appears once per page, and site-wide where possible (see "Content map").

## Tokens

The colour tokens are the CSS variables in `src/styles/app.css` (light and dark), unchanged by this design. Additions and conventions:

| Token / value                                           | Use                                             |
| ------------------------------------------------------- | ----------------------------------------------- |
| Grid line: `primary` at 7% (light) / 10% (dark) opacity | The blueprint band's 32px grid                  |
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

**Spacing:** header band padding 96px on top; 112–128px between sections; 40px from a section title to its content.

## Page anatomy

```
Site header        logo (mono) · Home · About · Projects        language · theme
Blueprint band     label (mono, uppercase)
                   page title
                   subtitle (mono, blue) and/or lead paragraph
                   buttons
                   strip: numbers (Home) or facts (About), first cell flush with the text
Sections           "01  Title ──────────────────  optional link"
                   content
Contact band       solid blue: "Contact" label, headline, availability line, Email me + LinkedIn
Site footer        © · LinkedIn GitHub · English العربية Français
```

## Patterns

- **Blueprint band:** a full-width area behind the page header with a 32px grid of 1px lines in the grid colour, closed by a 1px bottom border. Plain flat lines, not a gradient effect.
- **Strip:** a row of cells (`auto-fit`, at least 200px), a 1px top border, 1px vertical lines between cells, and the first cell flush with the text above. Home uses it for the headline numbers (big mono number above a grey caption); About uses it for facts (mono label above a value, with an optional grey second line).
- **Section title:** a mono number in `primary` ("01", hidden from screen readers), the title, a 1px line filling the rest of the row, and an optional link at the end ("All projects", "Full story"). Numbers count the sections shown on the page.
- **Project card:** bordered and rounded (12px) on `card`; the border darkens to `input` on hover. Top: the cover. Body: meta (type · year, mono), title, summary (grey), technologies, "Visit site ↗".
  - **Featured card:** the first project on Home is wide, with the cover on one side and a larger body on the other, plus a "Read the case study →" link.
  - **Cover placeholder** (until a screenshot is uploaded): an "app window" bar (three small squares, then the project's address or slug in mono) over the blueprint grid on `muted`, with the project's initials large in mono `primary`.
- **Technologies:** logo (one colour, `currentColor`) then the name, with no border, in rows with generous gaps.
- **Services ("What I do"):** borderless grid, each item with a 1px top line, a Lucide icon in `primary` (stroke 1.75), a mono index ("01"), the title and a grey summary.
- **Experience summary (Home):** rows with a 1px bottom line: period (mono, grey) · role (600, with a "Current" badge) · company and place (grey). Links to the full story on About.
- **Timeline (About):** a 1px line along the start edge; a filled blue dot for the current job, hollow for past ones; period and duration in mono, with a "Current" badge (1px blue border, blue mono text); role (22px 600), company and place (grey), summary, then achievements with small square blue bullets.
- **Skills:** spec-sheet rows with a 1px bottom line: a mono label column (180px), then the technologies.
- **Education:** rows like skills: the period in the label column, then degree and field (600), the school (link) and place, and a short grey description.
- **Languages:** three columns, each with a 1px top line, the name, a five-step meter (filled steps in `primary`, the rest in `border`) and the level in mono.
- **Contact band:** solid `primary`, text in `on-primary`, radius 16px, 56px padding. A white (`on-primary`) "Email me" button with blue text, and an outlined "LinkedIn ↗".
- **Buttons:** 44px tall (48px on the contact band), radius 6px. Primary: solid blue. Secondary: 1px `input` border. Text links with an arrow for "See my work →" and similar.

## Content map

| Page         | Says                                                                                                                                                 | Doesn't repeat                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Home         | Who (name, headline, pitch), proof (the headline numbers), selected work (featured projects), what I do (services), experience in two lines, contact | Full job details, education, skills                   |
| About        | A statement title ("I build web products, end to end."), facts strip, the story, timeline with achievements, skills, education, languages, contact   | The headline numbers as a block, project descriptions |
| Projects     | The full list with filters                                                                                                                           |                                                       |
| Project page | The case study                                                                                                                                       |                                                       |

Copy introduced with the design (editable): the About title "I build web products, end to end.", the contact headline "Have a project in mind? Let's build it.", and a bio trimmed to a story without the stats (to edit in the CMS).

## Arabic

Everything mirrors with logical CSS (start/end): the timeline line and markers, strip dividers and the section-title rule move to the right. Labels in Arabic use the sans font with normal spacing (see `mono-label` in `ARCHITECTURE.md`).

## Moving the current pages to this design

The pages built so far predate this design. They move over step by step:

1. **Shared pieces:** the blueprint band in `PageHeader`, borderless `FactsStrip` and `MetricGrid` as strips, section titles with an optional end link, the contact band in the site layout, technology chips without borders, and the branded cover placeholder.
2. **Home:** featured work, "What I do", the experience summary (this replaces the planned step 5).
3. **About:** statement title, skills, education and languages as rows, the timeline without company tiles.
4. **Projects and project page:** cards and covers in the new style.
