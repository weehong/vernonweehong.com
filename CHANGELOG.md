# Changelog

Every change to the website (commit 2, `feat(site): set up personal website`), newest first. Articles are logged in [ARTICLES.md](ARTICLES.md). The rules for keeping this file are in [AGENTS.md](AGENTS.md#commits-and-history).

## 2026-11-09

### Added

- The site, built from the design spec in `docs/design/`: English and Chinese editions, homepage, printable resume and PDF, bilingual Writing index and posts with search and RSS, contact form, email sign-up, SEO metadata and share images.
- Menu button below 1024px wide: opens the "On this page" and "Elsewhere" links in a sheet from the right, replacing the link column on phones and tablets.
- "No posts yet" message in the Writing archive when an edition has no posts.
- Agent docs in `docs/agents/` for local markdown issues (`docs/issues/`), triage labels and domain docs, linked from `AGENTS.md`.
- The three-commit rule, this changelog and `ARTICLES.md`.
- De-identification guide in `docs/agents/de-identification.md`, linked from `AGENTS.md`: post drafts drop the employer's internal systems, access tooling, test accounts, people and figures, and keep a table of what Vernon has decided may stay.
- Post rule in `docs/design/pages.md`: the Chinese edition explains in Chinese, using the terms engineers in China use instead of English words.

### Changed

- Commit 2 is titled `feat(site): set up personal website`, in place of `feat(site): add bilingual personal website`; `AGENTS.md` and this file name it so.
- Writing topic cards: smaller title (32px), post count on the right at 44px with a small "posts" label.
- The EN and 中文 language buttons are the same width.

### Fixed

- Bullet points show again on job outcomes (homepage and resume) and on lists in posts.
- Jumping to a section on the Writing page puts its heading below the sticky search bar instead of under it.
- The "On this page" highlight follows the scroll on the Writing page instead of staying on Search.
- Picking a topic with no posts no longer shows "Nothing matches “”".
