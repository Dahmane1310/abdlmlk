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

| Element            | Style                                                                                                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page title (h1)    | Plex Sans 600, `clamp(44px, 7vw, 84px)` on Home, `clamp(40px, 6vw, 72px)` elsewhere, `clamp(34px, 4.5vw, 52px)` on articles (a title there is a sentence), letter-spacing −0.035em, line-height ≈1.02 |
| Article text       | Plex Serif 20px, line-height 1.75 (Arabic: Plex Sans Arabic 19px, 1.95); headings Plex Sans 26px 600                                                                                                  |
| Subtitle           | Plex Mono 18px in `primary` (e.g. "Full-Stack Engineer")                                                                                                                                              |
| Lead paragraph     | 20–22px, foreground                                                                                                                                                                                   |
| Section title (h2) | 28px 600, letter-spacing −0.02em                                                                                                                                                                      |
| Card title (h3)    | 20px 600 (30px on the wide featured card)                                                                                                                                                             |
| Body               | 16–17px, line-height 1.6                                                                                                                                                                              |
| Secondary text     | 15px, `muted-foreground`                                                                                                                                                                              |
| Label              | Plex Mono 12px, uppercase, letter-spacing 0.06em, `muted-foreground`                                                                                                                                  |
| Meta / dates       | Plex Mono 12–13px, `muted-foreground`                                                                                                                                                                 |
| Big numbers        | Plex Mono 500, 36px, letter-spacing −0.02em                                                                                                                                                           |

**Spacing:** header band padding 96px on top; 112–128px between sections; 40px from a section title to its content. About is the one exception, with 80px between sections: it's the online CV and reads as one document (owner's choice).

## Page anatomy

```
Site header        [DA] name       HOME  ABOUT  PROJECTS  BLOG       language · theme · [Contact]
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

- **Site header:** sticky, 64px, on `background` with a 1px bottom border (the "spec bar", owner's choice).
  - **Start:** a 28px `primary` square with the site name's initials in mono ("DA", decorative), then the name in mono.
  - **Pages:** centred in the bar (three columns, the outer two equal), as mono labels without numbers (owner's choice), grey until hovered. The current page turns foreground with a 2px `primary` line on the header's bottom edge, the same marker as the project filters.
  - **End:** language, theme, then a small solid "Contact" button that jumps to the page's contact band. Every page with the header ends with that band (the 404 page included); the button hides only when the CMS has neither email nor LinkedIn, like the band.
  - **Below 1024px:** the mark, the name, "Contact" and a menu button. The menu (a panel from the end side) lists the pages large (24px 600), the current one foreground with a 2px `primary` line on its start edge, then the languages and the theme switch at the bottom.
- **Blueprint band:** a full-width area behind the page header with a 32px grid of 1px lines in the grid colour, closed by a 1px bottom border. Plain flat lines, not a gradient effect.
- **Transition band and strip:** on every page, a full-width band in solid `muted` sits between the blueprint band and the plain page, closed by a 1px bottom border, so the page steps from grid to tint to plain (owner's choice; the mockup had the strip inside the grid, and pages without one felt empty). The blueprint band holds text and buttons; the transition band holds the page's figures or controls. Figures go in a strip: a row of cells with 1px vertical lines between them and the first cell flush with the text, two cells per row on phones (with a 1px line between the rows).
  - **Home:** the headline numbers (big mono number above a grey caption).
  - **About:** the CV at a glance (see "About header").
  - **Project pages:** the project's facts (mono label above a value, with an optional grey second line).
  - **Projects:** the filters, the page's controls (see "Projects filters").
  - **Blog:** the blog in numbers, like Home: articles, series, topics (see "Blog list").
- **Projects filters:** the types as a strip: one cell per type (and "All"), a mono label above its project count (36px mono, like Home's numbers), the whole cell a link. The chosen cell's label and count turn `primary`, with a 2px `primary` line along its bottom edge; the others keep a black count and a grey label. Type is the only filter: the owner removed the technology filter (few projects list their technologies). No bordered chips (owner found them busy). Each cell is a link, so each filtered view has its own shareable address.
- **Section title:** a mono number in `primary` ("01", hidden from screen readers), the title, and an optional link at the end of the row ("All projects", "Full story"). No line after the title: right under the header band it doubled the band's bottom edge (owner's choice). Numbers count the sections shown on the page.
- **Section divider:** a 1px line in `border`, running edge to edge like the header band's bottom edge, midway between two sections. None above the first section (the band's edge is there) and none above the contact band (the blue card separates itself). Owner's choice, so the page reads as a stack of full-width bands. A case study's own sections (its headings in the CMS text) are spaced and divided the same way.
- **Project page:** the header (back link, title, summary, Visit site / Source code) with the project's facts in the transition band; then the cover (when there is one), "Key numbers", the case study's sections, "Tech stack" (the larger logos, like About's skills) and the gallery, all numbered in one sequence; then Previous / Next project. The case study keeps the reading width (768px). Bulleted lists in any CMS text use the small square blue bullets.
- **Project card:** bordered and rounded (12px) on `card`; the border darkens to `input` on hover. Top: the cover. Body (24px padding, 10px gaps): meta in mono, the type and years only so it fits one line ("Client project · 2024", "Product · 2023 — 2024"; the client and exact dates are on the project page), title (20px 600), summary (15px, grey), technologies, "Visit site ↗".
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
- **Blog list:** Medium's text-first feed, at the reading width (768px), one article per row, rows 56px apart with no lines. Each row: date · reading time · "Part 2 of 3" (mono, grey), the title (24px 600, underlined on hover), the description (17px, grey, two lines at most), the topics (small mono links). A small cover (160px, 4:3) sits on the end side only when the article has one. The whole row is clickable, like a project card.
  - **Numbers:** the transition band counts the articles, series and topics in Home's number style, with the word under each number agreeing with it in every language ("1 series", «3 مقالات»). A count of zero is left out.
  - **Topics:** each article's topic links filter the list; the address keeps the topic (`?tag=arabic`), and the filtered list opens with "Topic: Arabic ✕", the ✕ going back to every article. (A row of topic links in the band was tried and dropped: the owner found it messy.)
- **Article page:** read like Medium, inside the site's frame.
  - **Header:** "← All articles", the title (the article size), the description as the lead.
  - **Transition band, the byline:** the site mark (40px) and the author's name, then date · reading time · "Part 2 of 3" in mono, with the article's topics on the end side.
  - **Body:** the cover, when there is one (16:9, full width), then the text in a 680px column: Plex Serif 20px with a line-height of 1.75, headings in Plex Sans without the site's section numbers or lines (an article reads as one continuous text, owner's choice), pull quotes in 26px italic serif with the blue line on the start edge. Arabic articles stay in Plex Sans Arabic (Plex has no Arabic serif) and never use italics.
  - **Code blocks:** a bar with the file name and a "Copy" button that says "Copied" for two seconds. Inline code is always a left-to-right run of its own, so its brackets don't reorder inside Arabic text.
  - **Contents:** on wide screens, an article with two sections or more lists them beside the text under a mono "Contents" label, and the list follows the reader down the page. The section being read is marked like the current page in the navbar: foreground text and a 2px blue line, here on the start edge. A section opened from the list stops just under the navbar. Phones don't show it, so the text starts right away.
  - **Reading progress:** a 2px blue bar along the top of the screen fills as the text is read, from the start edge (the right in Arabic).
  - **Likes:** 56px below the text, a round 48px outline button with a heart, and the total beside it in grey mono, hidden at zero. One like per reader, undone by clicking again; once liked, the heart is filled blue and the button's edge turns blue. The article's languages share one count.
  - **Share:** on the end side of the same row, a mono "Share" label, then "LinkedIn ↗", "X ↗" and "Copy link" in small grey mono, like the code blocks' Copy button ("✓ Copied" for two seconds). LinkedIn and X open in a new tab. On touch screens, the three are one outline "Share" button that opens the phone's share sheet.
  - **Responses:** beside the like button, a matching round button with a speech bubble and the number of responses jumps to them. After the series card, "Responses (3)" (24px 600, the count in grey mono), then every approved response, oldest first: initials in a 40px grey circle, the name, the date in mono, then the text as written, line breaks kept. Replies sit under their response, indented with a 1px line on the start edge. The owner's replies show the blue site mark and a blue mono "Author". A response reads in its own direction, so an English one on an Arabic page stays left to right. Responses belong to the language they were written in.
  - **Response form:** first under "Responses", in a bordered card like the series card: Name and Email side by side (stacked on phones; the email "Never shown on the site." and always left to right), then "Your response", which grows with the text. Under them, "Responses appear once they are approved." and a blue "Publish" button on the end side ("Sending…" while it sends). Errors appear in red under their field once it's left or the form is sent. Once sent, the card says "Thanks! Your response will appear here once it's approved." instead. When the owner closes responses for an article, a grey "Responses are closed for this article." takes the form's place.
  - **Series:** an article in a series ends with one bordered card like the code blocks, 56px below the text and on every screen size: "Series" in mono, the series title, then every part in order with its number in mono. The part being read is marked like the contents (foreground, 2px blue line on the start edge); the others are grey links, and the one after it says "Next →" in blue on the end side. The last part has no "Next". The series title links to the series page.
- **Series page:** the header as on an article ("← All articles", the series title, its description as the lead) with a "Start with part 1 →" button; the transition band shows the number of parts and the minutes of reading for the whole series; then the parts in order, as the blog list's rows at the reading width.
- **Buttons:** 44px tall (48px on the contact band), radius 6px. Primary: solid blue. Secondary: 1px `input` border. Text links with an arrow, pointing the reading way (left in Arabic): "See my work →" in Home's header (jumps to Selected work), and "All projects →" / "Full story →" at the end of a section title.

## Content map

| Page         | Says                                                                                                                                                 | Doesn't repeat                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Home         | Who (name, headline, pitch), proof (the headline numbers), selected work (featured projects), what I do (services), experience in two lines, contact | Full job details, education, skills                                                       |
| About        | The online CV: a plain header with Download CV, the CV at a glance, jobs with achievements, skills, education, languages, contact                    | Who I am (name, photo, bio, status, location), the headline numbers, project descriptions |
| Projects     | The full list with filters                                                                                                                           |                                                                                           |
| Project page | The case study                                                                                                                                       |                                                                                           |
| Blog         | The blog in numbers, then the articles, newest first, filterable by topic                                                                            |                                                                                           |
| Article      | The article, with its byline (author, date, reading time, series part, topics); after the text, its likes, its series' parts and readers' responses  |                                                                                           |
| Series       | What the series covers, its size (parts, minutes of reading) and its parts in order                                                                  |                                                                                           |

Copy introduced with the design (editable, in the dictionaries): the contact headline "Have a project in mind? Let's build it.", and the About title "Experience & skills" with its line "The jobs, tools and studies behind my work."

## Arabic

Everything mirrors with logical CSS (start/end): the spec rows' label column, the square bullets, strip dividers and the section titles' end links move to the right. Labels in Arabic use the sans font with normal spacing (see `mono-label` in `ARCHITECTURE.md`).

## Moving the current pages to this design

The pages built so far predate this design. They move over step by step:

1. **Shared pieces** (done): the blueprint band in `PageHeader`, the transition band on every page (numbers, facts or filters), 28px section titles, the contact band (added by `Page`, and by the 404 page; the error page, shown when the CMS is down, has no CMS data for it), technology chips without borders, the branded cover placeholder, and black body text.
2. **Home** (done): featured work with "See my work" and the section titles' end link, "What I do", and the experience summary (this replaced the planned step 5).
3. **About** (done): the online CV with a plain header, then experience, skills, education and languages as spec rows.
4. **Projects and project page** (done): cards in the new style; on the project page, full-width lines between the case study's sections, square blue bullets, and the tech stack as its own section instead of a side panel.
