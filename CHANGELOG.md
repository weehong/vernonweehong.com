# Changelog

Every change to the website (commit 2, `feat(site): set up personal website`), newest first. Articles are logged in [ARTICLES.md](ARTICLES.md). The rules for keeping this file are in [AGENTS.md](AGENTS.md#commits-and-history).

## 2026-11-14

### Added

- Job-specific resume guide in `docs/agents/job-resume.md`, linked from `AGENTS.md`: from a job posting, the general resume is retold in the posting's terms with power verbs, dense highlights and bold key phrases, using only facts the general resume holds.
- `npm run job-resume -- <folder>` renders `resumes/<folder>/resume.json` to a PDF with the site's resume layout; the `resumes/` folder is ignored by git.
- The resume PDF renders `**…**` as bold in the summary and project descriptions as well as experience highlights.

### Changed

- The resume adds JPA / Hibernate, GraphQL, Microservices and Linux to its skills, a DBS point on setting testing, CI/CD and code-quality standards and mentoring junior engineers, and incident response to the DBS reliability point.
- The resume (page and PDF) lists employers only under Experience; Life Poem and the enquiry triage proof of concept are now entries under Projects, and "Last updated" reads 14 November 2026.
- The homepage experience list keeps one entry the resume does not have; the structured data, which reads the resume, names DBS Bank as the only current employer.

## 2026-11-11

### Fixed

- The homepage and resume structured data give `dateModified` as a full date-time with the Singapore offset (`2026-11-09T00:00:00+08:00`) instead of a bare date, which Google Search Console reported as an invalid datetime on the profile page.

## 2026-11-09

### Added

- The site, built from the design spec in `docs/design/`: English and Chinese editions, homepage, printable resume and PDF, bilingual Writing index and posts with search and RSS, contact form, email sign-up, SEO metadata and share images.
- Menu button below 1024px wide: opens the "On this page" and "Elsewhere" links in a sheet from the right, replacing the link column on phones and tablets.
- "No posts yet" message in the Writing archive when an edition has no posts.
- Agent docs in `docs/agents/` for local markdown issues (`docs/issues/`), triage labels and domain docs, linked from `AGENTS.md`.
- The three-commit rule, this changelog and `ARTICLES.md`.
- De-identification guide in `docs/agents/de-identification.md`, linked from `AGENTS.md`: post drafts drop the employer's internal systems, access tooling, test accounts, people and figures, and keep a table of what Vernon has decided may stay.
- Post rule in `docs/design/pages.md`: the Chinese edition explains in Chinese, using the terms engineers in China use instead of English words.
- Code blocks in posts show line numbers and a "Wrap lines" toggle. Blocks over 30 lines open as a 20-line scrollable preview with a "Show all N lines" button.
- Callouts in posts with GitHub syntax (`> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`), each with its own line icon and colour bar, and an optional custom title.
- Tables (homepage and posts) can be reached with the Tab key and scrolled with the arrow keys when they scroll sideways on narrow screens.
- Tables in posts have a style: bordered box, grey header row with small uppercase labels, ruled rows, and sideways scrolling on narrow screens.
- Long post tables are capped at 480px tall and scroll down inside their box, with the header row pinned at the top.
- Inline code inside a post table stays on one line, so IDs and timestamps no longer break at their hyphens; the table scrolls sideways instead.
- A long piece of inline code in a post no longer makes the page scroll sideways on phones.
- Code highlighting colours strings, numbers, functions, JSX tags and attributes too, with a separate softer palette in the dark theme.

### Changed

- Commit 2 is titled `feat(site): set up personal website`, in place of `feat(site): add bilingual personal website`; `AGENTS.md` and this file name it so.
- Writing topic cards: smaller title (32px), post count on the right at 44px with a small "posts" label.
- The EN and 中文 language buttons are the same width.
- Post section headings match the homepage: a rule line with a dark §n marker above the heading.
- The resume sits on a paper sheet on screen (white card, hairline border, soft shadow; edge to edge on phones). Print and the PDF are unchanged.
- "Last updated" moves from the end of the resume to a stamp at the top, opposite the "Resume" label.
- Resume text (summary, skills, highlights, project descriptions) is justified on the page.
- The resume page uses the site design on screen: numbered §1–§6 section labels, the title in yellow highlight, the homepage profile card beside the name, and an experience timeline with green dots and a "Current" tag for current roles. Print stays plain.
- "On this page" and "On this post" numbers stay on the first line when a section name wraps.

### Fixed

- Bullet points show again on job outcomes (homepage and resume) and on lists in posts.
- Jumping to a section on the Writing page puts its heading below the sticky search bar instead of under it.
- The "On this page" highlight follows the scroll on the Writing page instead of staying on Search.
- Picking a topic with no posts no longer shows "Nothing matches “”".
- Post text, the post standfirst, the "How this post was written" box and the resume summary fill their column instead of stopping at a narrower width of their own.
