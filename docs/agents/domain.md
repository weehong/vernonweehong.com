# Domain docs

This repo is a single context: one glossary and one decision log for the whole site.

| Doc                     | Holds                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `CONTEXT.md` (root)     | The glossary: the site's domain terms (edition, post pair, topic, the AI disclosure…) and what each means. |
| `docs/adr/NNNN-slug.md` | Architecture decision records: one decision each, with its context, the choice, and the trade-off.         |
| `docs/design/`          | The design spec: UI, routing, interface text and content rules. It stays the source of truth for those.    |

- Neither `CONTEXT.md` nor `docs/adr/` exists yet. Create each the first time a term or a decision needs recording; the `domain-modeling` skill covers their format.
- `CONTEXT.md` defines a term and links to the spec section that governs it. Rules that live in `docs/design/` stay there, so each rule has one home.
- Use the glossary's words in code, issues and commit messages, so a term means the same thing everywhere.
