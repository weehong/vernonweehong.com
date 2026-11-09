<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commits and history

This repository keeps exactly **three commits**, oldest first. Their subjects are fixed and are how you find them, since hashes change on every amend:

| #   | Subject                               | Holds                                                                                                                                                  |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `chore: initialize repository`        | The empty base. It never changes.                                                                                                                      |
| 2   | `feat(site): set up personal website` | The website: every file except articles, including `CHANGELOG.md`.                                                                                     |
| 3   | `feat(writing): publish articles`     | Articles only: the post files in `content/writing/` (both languages) and `ARTICLES.md`. Created holding `ARTICLES.md` alone, before the first article. |

Every change folds into commit 2 or 3 by amending; the history stays at three commits. A change that touches both site and article files is split: site files into 2, article files into 3.

### Logging changes

The history no longer shows what changed, so two logs carry it. Update the log in the same amend as the change it records.

- **Website change** → add an entry to `CHANGELOG.md`: newest date first, under `### Added`, `### Changed`, `### Fixed` or `### Removed`, one plain sentence per change naming what a visitor or developer would notice. Done when every change in the amend has a line.
- **Article published, updated or unpublished** → add or update its row in `ARTICLES.md`. Dates copy the post's frontmatter (`publishedOn`, `updatedOn`, `status`); the frontmatter wins when they disagree.

### Amending

Commit only when Vernon asks. Then:

1. Stage the change and its log entry.
2. Fold it in:
   - **Article change** (commit 3 is always the last): `git commit --amend --no-edit`.
   - **Website change**: `git commit --fixup=<commit 2>`, then `git rebase --autosquash <commit 1>`. Find a commit's hash by its subject: `git log --format=%h --fixed-strings --grep="<subject>" -1`.
   - **While commit 3 does not exist yet**: amend the website change into commit 2 (then the last commit) with `git commit --amend --no-edit`, then commit `ARTICLES.md` on its own with the subject `feat(writing): publish articles`.
3. Keep each subject as written above. Rewrite a commit's body (see [Commit messages](#commit-messages)) when the change makes its summary untrue: a new feature, page or integration, or one removed.
4. Check: `git log --oneline` lists at most the three subjects above, in that order.

Push only when Vernon asks. Rewritten history needs `git push --force-with-lease`. Other branches (such as `backup/*`) are Vernon's; leave them as they are.

### Commit messages

Every message follows [Conventional Commits](https://www.conventionalcommits.org/) strictly; the `commit-msg` hook checks it with commitlint (`@commitlint/config-conventional`), and a message it rejects is rewritten, never bypassed.

- **Header**: `type(scope): subject`, exactly the subject in the table. Lowercase imperative subject, no full stop, at most 72 characters.
- **Body**: after one blank line, a snapshot of what the commit holds today, in the present tense, as if the project were written in one go: what the site is, then its parts as a `-` list. History (what was fixed, changed or redone, and when) belongs in `CHANGELOG.md` and `ARTICLES.md`. Wrap lines at 72 characters.
- **Footer**: after one blank line, the trailer `Co-Authored-By: <model> <noreply@anthropic.com>` (or the equivalent for another assistant).

Commit 1 has no body or footer.

## Agent skills

- **Issues** are local markdown files in `docs/issues/` (this repo files nothing in GitHub Issues). Before filing, reading, updating or closing one, read `docs/agents/issue-tracker.md`.
- **Triage**: before labelling an issue or picking one up to work on, read `docs/agents/triage-labels.md`.
- **Domain docs**: before naming a domain concept or recording an architecture decision, read `docs/agents/domain.md`.
- **Job-specific resume**: when Vernon shares a job posting (URL or text) or asks for a resume tailored to a job, read `docs/agents/job-resume.md`.
- **De-identification**: before a post draft or update goes to Vernon for review, read `docs/agents/de-identification.md`.
