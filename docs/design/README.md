# Design spec — "the reviewed spec"

The implementation spec for the redesigned site. Follow it exactly. When the code and this spec disagree, the spec wins; when the spec is silent, stop and extend the spec first.

| File                                               | What it covers                                                                                                                                     |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [theme.css](theme.css)                             | Tailwind CSS v4 tokens: colours (both themes), fonts, type scale, radii, shadows, widths, dot patterns, base styles. Paste into `app/globals.css`. |
| [components.md](components.md)                     | Every component with its exact Tailwind classes, states, theme and language behaviour.                                                             |
| [pages.md](pages.md)                               | Routing for the two language editions, interface text, content files, search, subscriptions, page assembly, metadata.                              |
| [copywriting/home.json](copywriting/home.json)     | Approved homepage copy in English and Chinese, word for word from the canvas. The only source for homepage and profile text.                       |
| [copywriting/resume.json](copywriting/resume.json) | The approved, generic resume in English and Chinese, and the source of truth for career facts. The base for future job-specific resumes.           |

Visual references (private claude.ai artifacts, Vernon's account):

- Design canvas: https://claude.ai/artifact/2BvtbfiPz1pQPFouWTDP97 — page "Reviewed spec": homepage light, dark, phone (390px) and 中文; page "Writing": index EN, post EN, index 中文, post 中文. The index and post artboards are interactive (Play).
- Design system: https://claude.ai/artifact/7Go3Vf9W1xYSMKD387kAmd — brand guide and token notes. This folder supersedes it where they differ.

## Stack

- Next.js 16 (App Router; `proxy.ts`, not `middleware.ts`). Read `node_modules/next/dist/docs/` before writing framework code.
- Tailwind CSS v4 through the `@tailwindcss/turbopack` loader configured in `next.config.ts` (the create-next-app 16.4 default; Storybook uses `@tailwindcss/vite`). CSS-first configuration: tokens live in `@theme` blocks in `app/globals.css`. There is no `tailwind.config.js` or PostCSS config; do not add one.
- `next/font/google` for Bricolage Grotesque, Geist, Geist Mono and Noto Sans SC.
- MDX for posts (`@mdx-js/mdx` + `remark-gfm`, as on the Resetrix site), shiki for code highlighting.

## Hard rules

These are checked in review. Breaking one is a bug.

**Styling**

1. Use only the utilities the theme generates. No hex/rgb/named colours in components, no arbitrary colour values (`bg-[#…]`, `text-[rgb(…)]`), no inline `style` colours. Tailwind's default palette, radii and shadows are removed on purpose. Two exceptions only: share images (`ImageResponse` cannot read CSS variables) read colours from `lib/design-tokens.ts`, and the `/resume` print block in [pages.md](pages.md#resume-resume-zhresume) sets print colours.
2. Arbitrary values are allowed only where [components.md](components.md) writes them (layout bases like `flex-[999_1_640px]`, a few optical sizes). Do not invent new ones; add a token instead.
3. No pure-black backgrounds. `ink` and `marker-ink` are text colours. Dark fills are `bg-night` (deep slate in light mode, near-white in dark mode); the dark-theme page is `bg-paper` (#1c2128). (Print output is ink on white paper, not a background, and is exempt.)
4. `marker` (the yellow highlighter) is a fill behind `marker-ink` text only. At most one highlighted phrase per heading, none in body text, never the only sign of a state.
5. No `dark:` overrides except where the spec shows them: every colour token already swaps with the theme.
6. Buttons and button groups are always right-aligned in their container; the primary action is last.
7. Repeated blocks share one layout: every project card is media-left/text-right; every dated row uses the 180px meta column.
8. Reference data (skills, background) is a table, never a card grid.

**Accessibility**

9. Every control is at least 44px tall (`min-h-11`/`size-11`), has a visible focus ring (base layer), and icon-only controls have an `aria-label`.
10. Text contrast 4.5:1 (3:1 at 24px+ and for control borders) in both themes. The token notes in `theme.css` list the measured ratios; do not pair tokens outside those notes.
11. Real elements: `<button>` for actions, `<a>`/`<Link>` for navigation, `<label>` for every field, `<th scope>` in tables, `role="status"`/`role="alert"` for form results.
12. Respect `prefers-reduced-motion` (handled in the base layer; do not bypass it).

**Language and content**

13. Two editions, English (`/`) and Chinese (`/zh`). A page never mixes languages: all interface text comes from the edition's dictionary, all content from the edition's files. The only exception is the `EN` / `中文` labels in the language switch. (Update emails hold both languages; this rule is about pages.)
14. Every published post exists in both languages under the same slug, topic and date. No single-language posts.
15. Vernon's surname is always written `KOH` in visible text ("Vernon KOH", "Vernon Wee Hong KOH"). Slugs and code identifiers are exempt.
16. Numbers are real. Every metric comes from `lib/profile/*`; never round up or invent one. Example posts in the mockups are placeholders and must not ship.
17. Homepage and profile text comes only from [copywriting/home.json](copywriting/home.json), resume text only from [copywriting/resume.json](copywriting/resume.json). New copy is written by AI from Vernon's notes in both languages and approved by him before it enters the JSON.
18. Writing is disclosed as AI-polished in three places, always with the dictionary wording: the AiNote on the Writing index, the AiTag on every post, and the HowWritten box after every post.
19. Free plans only. Never sign up for, upgrade to or enable a paid plan or add-on for any service (Buttondown included) unless Vernon says so. Email updates run on Buttondown's free plan, one newsletter with bilingual emails (Phase 1 in [pages.md](pages.md#subscriptions)).

**Structure**

20. Every page is built from one layout and components, nothing else. A route file (`page.tsx`, `layout.tsx`, `template.tsx`, `not-found.tsx`, `error.tsx`, `global-error.tsx`, `loading.tsx`, `opengraph-image.tsx`, `twitter-image.tsx`, `icon.tsx`, `apple-icon.tsx`, and any other `.tsx` in `app/`) has no markup of its own: no HTML elements, no `className` or `style`, no literal text. It reads params, loads data, and returns components. The one exception is the root layout's `<html>` and `<body>` ([pages.md](pages.md#page-assembly)).
21. Every page renders exactly one page layout from [components.md](components.md#page-layouts) (HomeLayout, WritingLayout, PostLayout, ResumeLayout, NotFoundLayout). A new kind of page gets a new layout in components.md first.
22. Markup lives only in `components/`, one component per file (a small family of variants may share one: `icons.tsx`, `chips.tsx`, `buttons.tsx`), as written in [components.md](components.md). A page section is a named component (AboutSection, ArchiveSection…), never inline JSX. Rule 20 is enforced by ESLint (`route-files-compose-only` in `eslint.config.mjs`); do not disable it.

## Definition of done (per page)

- [ ] Matches the canvas artboard at 1440px and 390px wide, in light and dark.
- [ ] The route file returns one page layout with components only, and `npm run lint` passes.
- [ ] Both editions render, with `<html lang>` set, the language switch pointing at the same page in the other edition, and no text from the other language.
- [ ] Only theme utilities used (`rg -n "#[0-9a-fA-F]{3,8}\b|rgb\(|bg-\[|text-\[#" app components` returns nothing outside `globals.css` and `lib/design-tokens.ts`).
- [ ] Keyboard: every control reachable, focus ring visible, `/` focuses search on the Writing index.
- [ ] No horizontal scroll at 390px (tables scroll inside their own box).
- [ ] Lighthouse accessibility 100; no console errors.
- [ ] Unit tests updated (dictionaries have identical keys; profile locales have identical numbers; post pairs validate).

## Changing the design

1. Update `theme.css` and/or `components.md`/`pages.md` here first, in the same pull request as the code.
2. If a token value changes, update its contrast note.
3. Keep the canvas and the design system in step when the change is visible (ask Vernon; they are claude.ai artifacts).
