# Issue tracker

Issues are markdown files in `docs/issues/`, committed with the code. The GitHub remote's issue tab is unused: when a skill says "create an issue" or "read the issue", it means a file here.

## Filing an issue

1. Name the file `docs/issues/NNNN-short-slug.md`: `NNNN` is the highest existing number + 1, zero-padded to four digits (start at `0001`); the slug is kebab-case.
2. Start it with this frontmatter and these sections:

   ```markdown
   ---
   title: Section headings hide under the sticky search bar
   status: open
   labels: [bug, needs-triage]
   created: 2026-11-09
   ---

   ## Problem

   What happens now, where (page, width, theme, edition), and how to reproduce it.

   ## Expected

   What should happen instead, linked to the spec in `docs/design/` when the spec covers it.

   ## Acceptance criteria

   - [ ] One checkable outcome per line.
   ```

3. Labels: one category (`bug` or `enhancement`) plus one triage state from [triage-labels.md](triage-labels.md). A new issue is `needs-triage`.

Done when the file exists with all three sections filled and both labels set.

## Reading and listing

The frontmatter is the index: grep `status: open` or a label across `docs/issues/` to list issues; read the whole file before working on one.

## Updating and closing

- Record new facts under a `## Notes` section, dated, rather than rewriting the Problem.
- To close: tick every acceptance criterion, set `status: closed`, add `closed: YYYY-MM-DD`, and add a `## Resolution` section naming what changed and in which files. Closing as `wontfix` gets the same Resolution section, saying why.
- Closed issues stay in the folder as history.
