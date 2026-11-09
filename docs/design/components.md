# Components

Every component on the site, with the exact Tailwind v4 classes to use. Class strings are normative: copy them as written. If a design need is not covered here, stop and add it to this file (and a token to `theme.css` if needed) before writing the code.

Conventions used below:

- `{…}` marks content or a prop. `«en» / «zh»` marks text that comes from the dictionary for the current locale (see [pages.md](pages.md#interface-text)). Never hard-code interface text in a component.
- "Both themes" is automatic: every colour utility is a token that swaps itself under `.dark`. Only use `dark:` where this file says so.
- "Chinese" is automatic too: font stacks, tracking and line heights switch on `lang="zh-Hans"`. Only add `zh`-specific classes where this file says so.
- Minimum touch target is 44px (`min-h-11` / `size-11`) on every link and button that is a control.
- Buttons and button groups are always right-aligned in their container (`ml-auto`, `self-end`, or `justify-end`).

**Where markup lives.** Every element and class string on the site is in a component in this file. Route files in `app/` (`page.tsx`, `layout.tsx`, `not-found.tsx`, the image routes…) only compose: one [page layout](#page-layouts) with components as its children. They never contain HTML elements, `className`, `style` or literal text (README hard rules 20–22; ESLint enforces it). A page section is a named component, never inline JSX in a page.

**Files.** One component per file under `components/{area}/` (a small family of variants may share one: `ui/icons.tsx`, `ui/chips.tsx`, `ui/buttons.tsx`), kebab-case file name, PascalCase export: `components/layout/page-shell.tsx` exports `PageShell`. Areas: `layout` (page layouts, PageShell, SiteHeader, LanguageSwitch, LinkColumn, SiteMenu, ThemeToggle, SiteFooter, ThemeScript, providers), `ui` (Highlight, buttons, ButtonGroup, badges, Section, SectionLabel, SectionHeading, Field, icons), `home`, `writing`, `post`, `resume`, `errors`, `share` (share images).

Contents: [Layout](#layout) · [Highlight](#highlight) · [Buttons](#buttons) · [Badges, tags and chips](#badges-tags-and-chips) · [Section heading](#section-heading) · [Homepage](#homepage-components) · [Writing](#writing-components) · [Post](#post-components) · [Resume](#resume-components) · [Not found](#not-found-components) · [Forms](#forms) · [Icons](#icons)

---

## Layout

### Page layouts

Every page renders exactly one of these, and nothing else at the top level. A new kind of page gets a new layout here first.

| Layout         | Pages                                   | Frame                             | `main` stack classes                                          |
| -------------- | --------------------------------------- | --------------------------------- | ------------------------------------------------------------- |
| HomeLayout     | `/`, `/zh`                              | PageShell with the link column    | `flex flex-col` (sections carry their own `pt-30`)            |
| WritingLayout  | `/writing`, `/zh/writing`               | PageShell with the link column    | `flex flex-col gap-18`                                        |
| PostLayout     | `/writing/{slug}`, `/zh/writing/{slug}` | PageShell with the link column    | `flex flex-col gap-12`                                        |
| ResumeLayout   | `/resume`, `/zh/resume`                 | Its own printable column (below)  | `flex flex-col gap-14 print:gap-[10pt]`                       |
| NotFoundLayout | `app/[lang]/not-found.tsx`              | PageShell without the link column | `flex min-h-[70vh] flex-col items-start justify-center gap-6` |

Props: `locale`, `dictionary`, `alternates` (for the LanguageSwitch), `linkColumn` (the LinkColumn's `sections` and `links`; HomeLayout, WritingLayout and PostLayout only) and `children`. Pages never pass class names. Each PageShell layout is a one-liner:

```tsx
export function WritingLayout({
	linkColumn,
	children,
	...shell
}: WritingLayoutProps): React.ReactElement {
	return (
		<PageShell {...shell} linkColumn={linkColumn} stack="flex flex-col gap-18">
			{children}
		</PageShell>
	);
}
```

**ResumeLayout** (no header, link column or footer; it must print cleanly):

```tsx
<div className="mx-auto max-w-[880px] px-8 pt-12 pb-24 max-sm:px-5 print:max-w-none print:px-[16mm] print:py-[14mm] print:[box-decoration-break:clone]">
	<ResumeActions homeHref={homeHref} dictionary={dictionary} />
	<main className="flex flex-col gap-14 print:gap-[10pt]">{children}</main>
</div>
```

### PageShell

The frame shared by HomeLayout, WritingLayout, PostLayout and NotFoundLayout: header, a two-track body (link column + main), footer. Only page layouts render it; `stack` comes from the table above.

```tsx
<div className="min-h-screen bg-paper text-ink font-sans text-body">
	<SiteHeader />
	<div className="mx-auto flex max-w-page flex-wrap items-start gap-x-16 page-gutter">
		{linkColumn && <LinkColumn {...linkColumn} />}{" "}
		{/* first: left on desktop, on top on phones */}
		<main className={`min-w-0 flex-[999_1_640px] pt-18 pb-24 ${stack}`}>
			{children}
		</main>
	</div>
	<SiteFooter />
</div>
```

- From `lg` (1024px) up, the link column sits left of `main`. Below `lg` it is hidden (`max-lg:hidden`) and the same links open from the [SiteMenu](#sitemenu) button in the header. PageShell passes `<SiteMenu />` to SiteHeader only when the page has a link column.
- Without a link column (NotFoundLayout), `main` takes the full width; the gutter and `max-w-page` come from the wrapper.

### SiteHeader

```tsx
<header className="border-b border-rule">
	<div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 page-gutter">
		<Link
			href={homeHref}
			className="inline-flex min-h-11 items-center gap-2.5 font-display text-xl font-bold tracking-title text-ink no-underline"
		>
			<span
				aria-hidden
				className="inline-flex size-8 items-center justify-center rounded-sm bg-marker font-display text-[15px] font-extrabold tracking-[-0.04em] text-marker-ink"
			>
				VK
			</span>
			Vernon KOH
		</Link>
		<div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
			<AvailabilityBadge />
			<LanguageSwitch />
			{menu /* SiteMenu: pages with a link column only */}
		</div>
	</div>
</header>
```

- The name is always "Vernon KOH" (surname in capitals) in both editions.
- `text-[15px]` and `tracking-[-0.04em]` are the only arbitrary values allowed here (monogram optical size).

### LanguageSwitch

A two-item segmented control. Each item links to the **same page** in the other edition (`alternates` from the route, see [pages.md](pages.md#routing)).

```tsx
<nav aria-label={«Language» / «语言»} className="inline-grid grid-cols-2 gap-0.5 rounded-[8px] border border-field-line p-0.5">
  <Link href={enHref} lang="en" hrefLang="en" aria-current={locale === 'en' ? 'page' : undefined}
        className="inline-flex min-h-10 items-center justify-center rounded-sm px-3 font-mono text-meta font-medium no-underline
                   text-ink-soft aria-[current=page]:bg-marker aria-[current=page]:text-marker-ink">EN</Link>
  <Link href={zhHref} lang="zh-Hans" hrefLang="zh-Hans" aria-current={locale === 'zh' ? 'page' : undefined}
        className="inline-flex min-h-10 items-center justify-center rounded-sm px-3 text-small font-medium no-underline [font-family:var(--font-noto-sc)]
                   text-ink-soft aria-[current=page]:bg-marker aria-[current=page]:text-marker-ink">中文</Link>
</nav>
```

- Labels are always `EN` and `中文` in both editions (each in its own script).
- Both segments are the same width: `inline-grid grid-cols-2` sizes each column to the wider label, and `justify-center` centres the shorter one.
- When switching, remember the choice in a `locale` cookie (1 year) so `/` can honour it next time; never auto-redirect on every request.

### LinkColumn

```tsx
<aside aria-label={«Page links»} className="flex flex-[1_1_200px] flex-col gap-8 pt-18">
  <nav aria-label={«On this page»} className="flex flex-col gap-2">
    <div className="mb-1 flex items-center justify-between gap-3">
      <p className="pl-3 font-mono text-label uppercase text-ink-muted">{«On this page»}</p>
      <ThemeToggle />
    </div>
    {sections.map((s, i) => <SectionNavItem key={s.id} n={i + 1} {...s} />)}
  </nav>
  <nav aria-label={«Elsewhere»} className="flex flex-col gap-1 border-t border-rule pt-6">
    <p className="mb-1 pl-3 font-mono text-label uppercase text-ink-muted">{«Elsewhere»}</p>
    {links.map((l) => <ElsewhereLink key={l.href} {...l} />)}
  </nav>
</aside>
```

**SectionNavItem** — the current section gets `aria-current="true"`. Scroll-spy (on scroll and resize, once per animation frame): the current section is the **last** one whose top is at or above the reading line, `max(40% of the viewport height, scroll-padding-top + 8px)`; before any section reaches it, the first. Counting from the last means a sticky section (the Writing SearchBar), which is always on screen, never holds the highlight.

```tsx
<a
	href={`#${id}`}
	aria-current={current ? "true" : undefined}
	className="flex min-h-11 items-center gap-3 rounded-sm px-3 text-body-sm text-ink-soft no-underline
              hover:text-ink aria-[current=true]:bg-marker aria-[current=true]:font-medium aria-[current=true]:text-marker-ink"
>
	<span className="font-mono text-label normal-case tracking-normal text-ink-muted [[aria-current=true]>&]:text-marker-ink">
		§{n}
	</span>
	{label}
</a>
```

**ElsewhereLink** — label left, glyph right (`←` back, `→` same site, `↗` external):

```tsx
<a
	href={href}
	className="flex min-h-11 items-center justify-between px-3 font-mono text-small text-ink no-underline hover:underline"
>
	{label}
	<span aria-hidden>{glyph}</span>
</a>
```

- On the real site the column is sticky on desktop: add `lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto` to the `aside`. (The canvas mockup could not show this.)
- Below `lg` the `aside` is hidden: add `max-lg:hidden`. The column also has a `menu` variant, used inside SiteMenu: the root is a `div className="flex flex-col gap-8"` (no `aside` landmark, no `pt-18`, no flex basis, not sticky), and every link calls `onNavigate` so the menu closes when one is followed.

### SiteMenu

The hamburger for screens below `lg`: a header button that opens the LinkColumn (`variant="menu"`) in a native modal `<dialog>`, a sheet from the right. Last item in the header's right group.

```tsx
<button type="button" aria-label={«Open menu» / «打开菜单»} aria-haspopup="dialog" aria-expanded={open}
        className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-field-line bg-transparent text-ink hover:border-ink lg:hidden">
  <MenuIcon />
</button>
<dialog aria-label={«Menu» / «菜单»}
        className="fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-full max-w-90 overflow-y-auto border-0 border-l border-rule bg-paper p-0 text-ink shadow-lift backdrop:bg-paper/80">
  <div className="flex min-h-full flex-col gap-6 px-5 pt-4 pb-10">
    <div className="flex items-center justify-between gap-3">
      <p className="pl-3 font-mono text-label uppercase text-ink-muted">{«Menu» / «菜单»}</p>
      <button type="button" aria-label={«Close menu» / «关闭菜单»} className="{same 44px icon button, without lg:hidden}"><CloseIcon /></button>
    </div>
    <LinkColumn variant="menu" onNavigate={close} />
  </div>
</dialog>
```

- Opens with `showModal()`, so focus moves into the sheet, the page behind is inert, and Escape closes it (focus returns to the button). A click on the backdrop and following any link also close it.
- The page behind does not scroll while it is open: the base layer sets `:root:has(dialog:modal) { overflow: hidden; }` ([theme.css](theme.css)).
- If the window grows to `lg` while it is open, it closes (a `matchMedia("(min-width: 64rem)")` listener).
- The backdrop is `paper` at 80%, a wash of the page colour in both themes, never a dark overlay.
- Elsewhere lists per page: Home page: Writing →, Resume →, GitHub ↗, LinkedIn ↗. Writing index: Home ←, Resume →, RSS ↗, GitHub ↗, LinkedIn ↗. Post: «All writing» ←, Home ←, RSS ↗, GitHub ↗.

### ThemeToggle

Icon-only, 44px, at the right end of the "On this page" label row.

```tsx
<button type="button" onClick={toggle} aria-label={isDark ? «Switch to light theme» : «Switch to dark theme»} title={sameAsAriaLabel}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm border border-field-line bg-transparent text-ink hover:border-ink">
  {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
</button>
```

- The pre-paint script is the `ThemeScript` component (`components/layout/theme-script.tsx`): the `next/script` `beforeInteractive` snippet from the old `app/layout.tsx` (branch `backup/pre-reset-2026-11-09`), same `vwhk-theme` localStorage key. The root layout renders it inside `<body>`.

### SiteFooter

```tsx
<footer className="border-t border-rule">
  <div className="mx-auto flex max-w-page flex-wrap justify-between gap-x-6 gap-y-2 py-6 page-gutter font-mono text-meta text-ink-muted">
    <span>© {year} Vernon Wee Hong KOH</span>
    <span>{«Backend engineer · Singapore» / «后端工程师 · 新加坡»}</span>
  </div>
</footer>
```

---

## Highlight

The highlighter is the brand's one loud element. Rules: a fill behind `marker-ink` text only; at most one highlighted phrase per heading; never in body text; never the only sign of a state.

```tsx
<mark className="highlight">{phrase}</mark>
```

- Hero statement only: add `animate-mark-draw` so it draws left to right on first load (disabled under reduced motion by the base layer).

---

## Buttons

All buttons: `inline-flex items-center gap-2 rounded-sm text-body-sm font-medium no-underline cursor-pointer`, at least 44px tall. Icon after the label, `size-4`, stroke 1.5.

| Variant          | Classes (add to the base)                                                                  | Use                                                        |
| ---------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Primary          | `min-h-12 px-5.5 bg-night text-on-night hover:bg-marker hover:text-marker-ink`             | The one main action ("Contact me", "Read the post")        |
| Secondary        | `min-h-11 px-4.5 border border-field-line text-ink hover:border-ink`                       | Beside a primary ("Read the resume", "Get posts by email") |
| On-marker submit | `min-h-12 px-6 bg-night text-on-night font-semibold`                                       | Inside a yellow panel (Subscribe)                          |
| On-night submit  | `min-h-12 px-6 bg-marker text-marker-ink font-semibold hover:bg-on-night hover:text-night` | Inside the night contact panel (Send message)              |

**ButtonGroup** — always right-aligned, primary last:

```tsx
<div className="flex flex-wrap justify-end gap-3">
	{secondary}
	{primary}
</div>
```

Arrow icon for in-page/next actions: `<svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current [stroke-width:1.5] [stroke-linecap:round] [stroke-linejoin:round]"><path d="M3 8h10M9 4l4 4-4 4"/></svg>`.

---

## Badges, tags and chips

| Name                    | Classes                                                                                                                                                                               | Use                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| AvailabilityBadge       | `inline-flex items-center gap-2 rounded-pill bg-signal-bg py-1 pr-3 pl-2.5 font-mono text-meta font-medium text-signal` + dot `size-2 rounded-pill bg-signal` (`aria-hidden`)         | Header, once                                                                                   |
| Tag                     | `rounded-xs bg-marker px-2 py-1 font-mono text-label normal-case tracking-normal font-medium text-marker-ink`                                                                         | Technologies under Experience entries and Project cards. Row: `flex flex-wrap gap-2`           |
| TopicChip · Tech        | `rounded-xs bg-night px-2 py-0.5 font-mono text-label normal-case tracking-normal text-on-night`                                                                                      | Post topic                                                                                     |
| TopicChip · Reflections | `rounded-xs bg-marker px-2 py-0.5 font-mono text-label normal-case tracking-normal text-marker-ink`                                                                                   | Post topic                                                                                     |
| StatusChip              | `rounded-xs bg-marker px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-label text-marker-ink`                                                                         | "Current" on live jobs; project labels ("In development", "Sold") use `bg-night text-on-night` |
| SkillChip               | `rounded-xs bg-sunken px-2.5 py-1.5 font-mono text-meta` ; daily driver: `bg-night text-on-night`                                                                                     | Inside the skills table only                                                                   |
| FilterChip              | `min-h-10 rounded-sm border border-field-line px-3.5 font-mono text-meta text-ink-soft cursor-pointer aria-pressed:border-marker aria-pressed:bg-marker aria-pressed:text-marker-ink` | Archive topic filter. Group: `role="group" flex flex-wrap justify-end gap-1.5`                 |
| SectionNumber           | `inline-flex h-7 min-w-7 items-center justify-center rounded-xs bg-night font-mono text-label normal-case tracking-normal text-on-night`                                              | `§1`… in section labels. In the night contact panel use `bg-marker text-marker-ink`            |

---

## Section heading

Every main section starts with one. The number matches the link column.

**SectionLabel** — the numbered rule line on its own (Writing index sections use only this):

```tsx
<p className="flex items-center gap-3 border-b-2 border-rule-strong pb-3 font-mono text-label uppercase">
	<SectionNumber>§{n}</SectionNumber>
	{label}
</p>
```

**SectionHeading** — label plus headline (homepage sections):

```tsx
<header className="flex flex-col gap-4">
	<SectionLabel n={n} label={label} />
	<h2 className="font-display text-heading">
		{lead}
		<mark className="highlight">{phrase}</mark>
		{tail}
	</h2>
</header>
```

- `h2` max width when it is a long sentence: `max-w-[20ch]` (English) — omit for Chinese.

**Section** — the homepage section block (every section after the hero):

```tsx
<section id={id} className="flex flex-col gap-10 pt-30">
	<SectionHeading n={n} label={label} lead={lead} phrase={phrase} tail={tail} />
	{children}
</section>
```

---

## Homepage components

### Hero

```tsx
<section className="flex flex-wrap items-stretch gap-x-12 gap-y-10 pt-18">
  <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-6">
    <p className="font-mono text-meta text-ink-muted">{«Backend engineer · Singapore · GMT+8»}</p>
    <h1 className="font-display text-display-xl">Vernon<br />KOH<span className="text-marker [-webkit-text-stroke:2px_var(--ink)]">.</span></h1>
    <p className="max-w-[20ch] font-display text-statement">{lead}<mark className="highlight animate-mark-draw">{phrase}</mark>{tail}</p>
    <p className="max-w-[48ch] text-lead text-ink-soft">{intro}</p>
    <ButtonGroup>{/* Secondary «Read the resume», Primary «Contact me» → #contact */}</ButtonGroup>
  </div>
  <ProfileCardPanel />
</section>
```

### ProfileCardPanel

The profile as an API response, on a dotted panel.

```tsx
<div className="flex min-w-0 flex-[1_1_300px] items-end rounded-md bg-sunken dots-on-sunken pt-8 pl-8">
	<div className="min-w-0 flex-auto overflow-hidden rounded-tl-md rounded-br-md border border-ink bg-raised">
		<p className="flex flex-wrap justify-between gap-x-3 gap-y-1 border-b border-rule px-4 py-3 font-mono text-label normal-case tracking-normal text-ink-soft">
			<span>GET /v1/engineers/vernon-koh</span>
			<span className="text-signal">200 OK</span>
		</p>
		<dl className="grid grid-cols-[minmax(0,80px)_minmax(0,1fr)] gap-x-3 px-4 pt-1 pb-2 text-small">
			{/* per row: */}
			<dt className="border-b border-rule py-2.5 font-mono text-label normal-case tracking-normal text-ink-muted">
				{key}
			</dt>
			<dd className="m-0 border-b border-rule py-2.5">{value}</dd>
			{/* last row: no border-b */}
		</dl>
	</div>
</div>
```

Rows: role, company, markets, stack, with keys and values from [copywriting/home.json](copywriting/home.json) `hero.profileCard`. Keys are localised in the Chinese edition (职位, 公司, 市场, 技术栈); the request line and `200 OK` stay unchanged in both.

### Entry (Experience row)

```tsx
<article className="flex flex-wrap gap-x-8 gap-y-2 border-t border-rule py-7 last:border-b">
  <div className="flex flex-[0_0_180px] flex-col items-start gap-1.5 font-mono text-meta text-ink-muted">
    <strong className="font-medium text-ink">{period}</strong>
    <span>{location}</span>
    {current && <StatusChip>{«Current» / «在职»}</StatusChip>}
  </div>
  <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3">
    <h3 className="font-display text-title-md">{role} <span className="font-semibold text-ink-muted">· {company}</span></h3>
    <ul className="m-0 flex list-disc flex-col gap-1.5 pl-4.5 text-body-sm text-ink-soft marker:text-ink-muted">
      {/* numbers inside outcomes: <strong className="font-semibold text-ink">30%</strong> */}
    </ul>
    <TagRow tags={tags} />
  </div>
</article>
```

- The 180px meta column is shared by every dated row on the site (Experience, tables, archive). Never change it in one place only.
- Bold every real number in an outcome; nothing else in body text is bold.

### ProjectCard

Media left, text right. Every project card uses this exact layout.

```tsx
<article className="flex flex-wrap overflow-hidden rounded-md border border-rule bg-raised">
	<ProjectMedia /> {/* flex-[1_1_320px] min-h-75 */}
	<div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 p-7">
		<div className="flex flex-wrap items-center gap-3">
			<h3 className="font-display text-title">{name}</h3>
			{label && (
				<StatusChip className="bg-night text-on-night">{label}</StatusChip>
			)}
		</div>
		<p className="text-body text-ink-soft">{description}</p>
		<TagRow tags={tags} />
	</div>
</article>
```

Media variants (all `flex-[1_1_320px] min-h-75 box-border p-8`):

- Screenshot (preferred): `<Image>` with `object-cover`, `bg-sunken`.
- Placeholder until screenshots exist: `bg-marker dots-on-marker flex items-center justify-center gap-4` with three phone outlines `h-49 w-24 rounded-[18px] border-2 border-marker-ink bg-paper` (middle one `-mt-10`), each with a mono `text-[10px] text-ink-soft` caption.
- Diagram: `bg-sunken dots-subtle flex flex-col justify-center gap-2.5 font-mono text-meta` (a `<figure aria-label>` describing the flow). Boxes: `rounded-sm border border-ink bg-raised px-3 py-2`; the key step `bg-marker text-marker-ink`; the result `bg-night text-on-night`; arrows `text-ink-muted` `aria-hidden`.
- Cards stack one per row, `gap-6`.

### NowNote

```tsx
<div className="flex flex-[1_1_260px] flex-col gap-2 self-start rounded-md border border-dashed border-field-line bg-raised p-5">
  <StatusChip className="self-start">{«Now» / «近况»}</StatusChip>
  <p className="text-body-sm">{now}</p>
</div>
```

### DataTable (Skills and Background)

Reference data is always a table, never a card grid.

```tsx
<div className="overflow-x-auto rounded-md border border-rule bg-raised">
  <table className="w-full min-w-[520px] border-collapse text-left text-body-sm">
    <thead><tr className="bg-sunken">
      <th scope="col" className="w-[180px] px-5 py-3 font-mono text-label uppercase text-ink-muted">{«Skill area»}</th>
      <th scope="col" className="px-5 py-3 font-mono text-label uppercase text-ink-muted">{«Tools»}</th>
    </tr></thead>
    <tbody>
      <tr className="border-t border-rule">
        <th scope="row" className="px-5 py-4 align-top font-mono text-meta font-medium text-ink">{area}</th>
        <td className="px-5 py-3"><div className="flex flex-wrap gap-2">{chips}</div></td>
      </tr>
    </tbody>
  </table>
</div>
```

- Skills table columns: Skill area · Tools (SkillChips; daily drivers dark, with the key below: `font-mono text-label normal-case tracking-normal text-ink-muted` and a `size-2.5 rounded-[2px] bg-night` swatch).
- Background table columns: Year · Type (TopicChip-style: Award `bg-marker`, Education `bg-sunken text-ink-soft`) · Background · Where (`text-ink-muted`). Year cells: `font-mono text-meta font-medium tabular-nums`.
- Two tables in the section, `gap-6` (skills block includes its key line).

### ContactPanel

The page's inverted block: `bg-night` (slate in light, near-white in dark).

```tsx
<section id="contact" className="pt-30">
  <div className="relative flex flex-wrap gap-x-14 gap-y-10 overflow-hidden rounded-md bg-night p-[clamp(24px,4vw,48px)] text-on-night">
    <div aria-hidden className="absolute top-0 right-0 h-40 w-[45%] dots-on-night" />
    <div className="relative flex min-w-0 flex-[1_1_320px] flex-col gap-5">
      <p className="flex items-center gap-3 font-mono text-label uppercase text-on-night-soft">
        <SectionNumber className="bg-marker text-marker-ink">§5</SectionNumber>{«Contact»}
      </p>
      <h2 className="font-display text-display-md">{«Let's talk »}<mark className="highlight">{«backends»}</mark>.</h2>
      <p className="max-w-[40ch] text-on-night-soft">{«Open to backend…»}</p>
    </div>
    <ContactForm />   {/* relative flex-[1_1_380px] min-w-0 — see Forms */}
  </div>
</section>
```

### Homepage sections

One component per section, so the page only lists them. Headline text (`lead`, `phrase`, `tail`) and content come from `lib/profile/{locale}.ts`.

**AboutSection** (§1):

```tsx
<Section id="about" n={1} label={«About»} {...about.heading}>
	<div className="flex flex-wrap gap-x-12 gap-y-8">
		<div className="flex min-w-0 max-w-[62ch] flex-[999_1_420px] flex-col gap-5">
			<p className="text-lead text-ink">{about.lead}</p>
			<p className="text-body text-ink-soft">{about.body}</p>
		</div>
		<NowNote now={about.now} />
	</div>
</Section>
```

**ExperienceSection** (§2): `<Section id="experience" n={2} …><div className="flex flex-col">{entries.map((e) => <Entry key={e.id} {...e} />)}</div></Section>` (DBS has `current`).

**ProjectsSection** (§3): `<Section id="projects" n={3} …><div className="flex flex-col gap-6">{projects.map((p) => <ProjectCard key={p.id} {...p} />)}</div></Section>`.

**SkillsSection** (§4):

```tsx
<Section id="skills" n={4} label={«Skills & background»} {...skills.heading}>
	<div className="flex flex-col gap-6">
		<div className="flex flex-col gap-3">
			<SkillsTable rows={skills.rows} />
			<SkillsKey />
		</div>
		<BackgroundTable rows={background.rows} />
	</div>
</Section>
```

SkillsTable and BackgroundTable are the two [DataTable](#datatable-skills-and-background) variants; SkillsKey is the key line described there. §5 is the ContactPanel.

---

## Writing components

### WritingHeader

```tsx
<header className="flex flex-col gap-5">
  <p className="border-b-2 border-rule-strong pb-3 font-mono text-label uppercase">{«Writing» / «写作»}</p>
  <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
    <h1 className={`flex-[999_1_420px] font-display text-display-lg ${locale === 'zh' ? 'max-w-[13em]' : 'max-w-[16ch]'}`}>{lead}<mark className="highlight">{phrase}</mark>{tail}</h1>
    <div className="flex flex-[1_1_260px] flex-col items-end gap-4">
      <p className="max-w-[34ch] text-right text-[17px] text-ink-soft">{intro}</p>
      <AiNote />
      <a href="#subscribe" className="{Secondary button}"><MailIcon className="size-4" />{«Get posts by email» / «邮件订阅»}</a>
    </div>
  </div>
</header>
```

Chinese-only differences are applied from `locale` in the component, as above. Do not add a custom Tailwind variant for languages: fonts, tracking and line heights already switch through `lang="zh-Hans"` in `theme.css`.

### SearchBar (sticky)

```tsx
<div id="search" role="search" className="sticky top-0 z-10 -mt-11 flex flex-col gap-2.5 border-b border-rule bg-paper pt-5 pb-6">
  <label htmlFor="writing-search" className="font-mono text-label uppercase text-ink-muted">{«Search everything I've written» / «搜索全部文章»}</label>
  <div className="flex min-h-17 items-center gap-3 rounded-md border-2 border-ink bg-raised pr-2 pl-5 shadow-offset">
    <SearchIcon className="size-6 shrink-0 stroke-ink" />
    <input id="writing-search" type="search" autoComplete="off" placeholder={…}
           className="h-16 min-w-0 flex-auto border-0 bg-transparent font-sans text-xl text-ink outline-none" />
    {query ? <ClearButton /> : <kbd aria-hidden className="mr-2 inline-flex h-8 min-w-8 items-center justify-center rounded-sm border border-b-2 border-field-line font-mono text-small text-ink-muted">/</kbd>}
  </div>
  <p className="font-mono text-label normal-case tracking-normal text-ink-muted">{hint}</p>
</div>
```

- `ClearButton`: `inline-flex size-12 items-center justify-center rounded-sm bg-sunken text-ink`, `aria-label={«Clear search»}`.
- `/` focuses the input (ignore when the focus is already in a field).
- `top-0` assumes the site header is not fixed. If a fixed bar is added, set `top` to its height.
- Anchor jumps land below the bar: a ResizeObserver on the bar sets `--sticky-top` on `<html>` to its height + 24px, and the base layer uses it as `scroll-padding-top` (0 on pages without the bar). This also keeps keyboard focus from scrolling under the bar. Remove the property on unmount.
- While a query is active, hide Latest and Topics (`browsing === false`) so results sit right under the bar.

### FeaturedPost (§2 Latest)

```tsx
<article className="flex flex-wrap overflow-hidden rounded-md border border-rule bg-raised">
  <div aria-hidden className="flex min-h-75 flex-[1_1_300px] flex-col justify-between bg-marker dots-on-marker p-7 text-marker-ink">
    <span className="font-mono text-label uppercase">{«New this month» / «本月新文»}</span>
    <span className="font-display text-numeral-xl">{postNumber}</span>
  </div>
  <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3.5 p-7">
    <PostMeta topic={…} date={…} minutes={…} />
    <h2 className="font-display text-title-lg">{title}</h2>
    <p className="text-[17px] text-ink-soft">{summary}</p>
    <a href={href} className="mt-auto self-end {Primary button}">{«Read the post» / «阅读全文»}<ArrowIcon /></a>
  </div>
</article>
```

- Post number = its position in the edition's archive (oldest = 01), zero-padded to 2 digits.

### TopicBlock (§3 Topics)

Two large buttons that set the topic filter. Grid: `grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4`.

```tsx
<button
	type="button"
	onClick={() => setTopic(id)}
	className="flex min-h-55 cursor-pointer flex-col gap-2.5 rounded-md border-0 p-7 text-left font-sans
                   {Reflections: 'bg-marker dots-on-marker text-marker-ink' | Tech: 'bg-night dots-on-night text-on-night'} bg-top-right"
>
	<span className="font-display text-title [font-weight:var(--weight-display)]">{name}</span>
	<span className="my-auto flex items-baseline gap-2 self-end">
		<span className="font-display text-numeral tabular-nums">{count}</span>
		<span className="font-mono text-label normal-case tracking-normal">
			{«posts» / «篇»}
		</span>
	</span>
	<span className="flex items-end justify-between gap-3 text-body-sm">
		{description}
		<span aria-hidden className="text-2xl">
			→
		</span>
	</span>
</button>
```

- Order: title at the top, the post count centred vertically (`my-auto` splits the free space above and below it) and right-aligned (`self-end`), description and arrow at the bottom.
- The count number is a step larger than the title (`text-numeral`, 44px, over the title's `text-title`, 32px); the word after it comes from `count.post` / `count.posts` with `{n}` removed, in the small mono label.

### ArchiveToolbar and rows (§4 Archive)

```tsx
<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
	<p role="status" className="font-mono text-meta text-ink-soft">
		{countLabel}
	</p>
	<FilterChipGroup />{" "}
	{/* All topics · Reflections · Tech — no language filter */}
</div>
```

**YearSeparator** — before the first post of each year, archive view only (hidden while searching). Alternate `night` (first year shown) and `marker`.

```tsx
<div
	role="separator"
	aria-label={`${year}, ${countLabel}`}
	className="mt-10 mb-2 first:mt-2 flex min-h-37.5 flex-wrap items-end justify-between gap-x-8 gap-y-3 rounded-md px-7 py-6 bg-top-right
                {even: 'bg-night dots-on-night text-on-night' | odd: 'bg-marker dots-on-marker text-marker-ink'}"
>
	<div className="flex flex-col gap-2.5">
		<span className="font-mono text-label normal-case tracking-normal">
			{countLabel}
		</span>
		<span className="font-display text-numeral-lg">{year}</span>
	</div>
	<div className="flex flex-wrap justify-end gap-2">
		{/* one CountChip per topic with ≥1 post that year */}
		<span className="inline-flex items-baseline gap-2.5 rounded-sm px-4.5 py-3 {even: 'bg-paper text-ink' | odd: 'bg-night text-on-night'}">
			<span className="font-display text-numeral">{n}</span>
			<span className="font-mono text-meta font-medium">{topicName}</span>
		</span>
	</div>
</div>
```

**ArchiveRow** — the post right after a separator drops its top rule (`border-t-transparent`):

```tsx
<article className="flex flex-wrap gap-x-8 gap-y-2 border-t border-rule py-6">
	<div className="flex flex-[0_0_180px] flex-col gap-1 font-mono text-meta text-ink-muted">
		<span className="mb-1.5 font-display text-numeral text-ink">
			{postNumber}
		</span>
		<strong className="font-medium text-ink">{date}</strong>
		<span>{minutesLabel}</span>
	</div>
	<div className="flex min-w-0 flex-[1_1_360px] flex-col gap-2">
		<div className="flex flex-wrap items-center gap-2">
			<TopicChip />
			{query && (
				<span className="font-mono text-label normal-case tracking-normal text-ink-muted">
					{whereLabel}
				</span>
			)}
		</div>
		<h3 className="font-display text-title-sm">
			<Link href={href} className="text-ink no-underline">
				{titleWithHits}
			</Link>
		</h3>
		<p className="text-body-sm text-ink-soft">{summaryOrSnippetWithHits}</p>
	</div>
</article>
```

- Search hits: `<mark className="rounded-[2px] bg-marker px-0.5 text-marker-ink">`.
- The list ends with a closing rule: `<div className="border-t border-rule" />`.

**EmptyState**

```tsx
<div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-md border border-dashed border-field-line bg-raised p-8">
  <div className="flex flex-[1_1_320px] flex-col gap-1.5">
    <p className="font-display text-title-sm">{«Nothing matches “{q}”» | «No posts yet»}</p>
    <p className="text-ink-soft">{«Try fewer letters…» | «The first one is on its way…»}</p>
  </div>
  {filtering && <button type="button" className="{Primary button}">{«Clear search and filters»}</button>}
</div>
```

- With a query: `empty.title` / `empty.hint`. Without a query (the edition has no posts, or none in the filtered topic): `empty.noPostsTitle` / `empty.noPostsHint`.
- The clear button shows only while a query or topic filter is active; with no posts and nothing to clear it is left out.

### WritingIndex and its sections

**WritingIndex** (`'use client'`) owns the search query and the topic filter, so the page stays a server component. It returns a fragment, so its parts sit directly in `main` and take the layout's `gap-18`:

```tsx
<>
	<SearchBar query={query} onQueryChange={setQuery} />
	{browsing && <LatestSection post={latest} />}
	{browsing && <TopicsSection topics={topics} onPick={setTopic} />}
	<ArchiveSection
		results={results}
		topic={topic}
		onTopicChange={setTopic}
		onReset={reset}
	/>
</>
```

`browsing` is false while a query or a topic filter is active (see [SearchBar](#searchbar-sticky)).

**LatestSection** (§2): `<section id="latest" className="flex flex-col gap-6"><SectionLabel n={2} label={«Latest»} /><FeaturedPost {...post} /></section>`.

**TopicsSection** (§3): `<section id="topics" className="flex flex-col gap-6"><SectionLabel n={3} label={«Topics»} /><div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">{two TopicBlocks}</div></section>`.

**ArchiveSection** (§4):

```tsx
<section id="archive" className="flex flex-col gap-5">
	<SectionLabel n={4} label={«Archive»} />
	<ArchiveToolbar />
	<div className="flex flex-col">
		{/* YearSeparator → ArchiveRows, per year */}
		{results.length > 0 ? <div className="border-t border-rule" /> : <EmptyState />}
	</div>
</section>
```

### SubscribePanel

Used at the end of the Writing index and after every post.

```tsx
<section id="subscribe" aria-labelledby="subscribe-title"
         className="flex flex-wrap items-center gap-x-10 gap-y-6 rounded-md bg-marker dots-on-marker bg-top-right p-8 text-marker-ink">
  <div className="flex flex-[1_1_280px] flex-col gap-2">
    <p className="font-mono text-label uppercase">{«Email updates» / «邮件更新»}</p>
    <h2 id="subscribe-title" className="font-display text-title">{«Get new posts by email» / «新文章发到你的邮箱»}</h2>
    <p className="max-w-[42ch] text-body-sm">{description}</p>
  </div>
  <div className="min-w-0 flex-[1_1_340px]">{done ? <SubscribeDone /> : <SubscribeForm />}</div>
</section>
```

See [Forms](#forms) for `SubscribeForm`. `SubscribeDone`: `role="status" flex flex-col gap-1.5 rounded-[8px] bg-raised p-5 text-ink` with a `font-display text-xl font-bold` title and a `text-body-sm text-ink-soft` line naming the address.

---

## Post components

### PostHeader

```tsx
<header className="flex flex-col gap-5 border-b-2 border-rule-strong pb-8">
  <Link href={indexHref} className="self-start inline-flex min-h-11 items-center font-mono text-meta text-ink-muted no-underline">← {«All writing» / «全部文章»}</Link>
  <PostMeta />   {/* TopicChip · date · minutes · AiTag, font-mono text-meta text-ink-muted, gap-x-3 gap-y-2, separators aria-hidden */}
  <h1 className="max-w-[22ch] font-display text-display-md">{lead}<mark className="highlight">{phrase}</mark></h1>
  <p className="max-w-reading text-lead text-ink-soft">{standfirst}</p>
</header>
```

Chinese titles put the highlight straight after the full-width colon, with no space (`审查 AI 写的代码：<mark>我先看什么</mark>`); let the line break where it falls.

### PostBody (MDX element map)

Wrapper: `<article className="flex max-w-reading flex-col gap-5 text-prose text-ink-soft">`.

| Element               | Classes                                                                                                                                                                                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| first `p` (lead)      | `text-[19px] text-ink`                                                                                                                                                                                                                                                                                         |
| `p`                   | `m-0`                                                                                                                                                                                                                                                                                                          |
| `h2`                  | `mt-7 font-display text-title text-ink` with a numbered prefix `<span className="mr-2.5 font-mono text-base font-medium tracking-normal text-ink-muted">§{n}</span>` and `id` = slug (feeds "On this post")                                                                                                    |
| `h3`                  | `mt-4 font-display text-title-sm text-ink`                                                                                                                                                                                                                                                                     |
| `ul` / `ol`           | `m-0 flex list-disc flex-col gap-2 pl-5.5 marker:text-ink-muted` (`ol`: `list-decimal`)                                                                                                                                                                                                                        |
| `a`                   | `text-ink underline decoration-field-line underline-offset-3 hover:decoration-ink`                                                                                                                                                                                                                             |
| `strong`              | `font-semibold text-ink`                                                                                                                                                                                                                                                                                       |
| inline `code`         | `rounded-xs bg-sunken px-1.5 py-px font-mono text-[15px] text-ink`                                                                                                                                                                                                                                             |
| `blockquote`          | `my-2 rounded-md bg-sunken px-5 py-4 font-display text-[22px] font-semibold leading-[1.35] tracking-title text-ink`                                                                                                                                                                                            |
| code block (`figure`) | `my-1 overflow-hidden rounded-md border border-rule bg-raised`; caption bar `flex justify-between gap-3 border-b border-rule bg-sunken px-4 py-2.5 font-mono text-label normal-case tracking-normal text-ink-muted` (file name · language); `pre` `m-0 overflow-x-auto px-5 py-4 font-mono text-code text-ink` |
| syntax colours        | comment `text-ink-muted`, keyword `text-code-keyword`, type `text-code-type`, everything else `text-ink`. Use shiki at build time with a custom theme that maps to these CSS variables (no shiki colour theme).                                                                                                |
| `img`                 | `rounded-md border border-rule` inside `<figure>`, caption `font-mono text-meta text-ink-muted`                                                                                                                                                                                                                |

### PostActions

```tsx
<div className="flex flex-wrap items-center justify-between gap-4 border-y border-rule py-5">
  <p className="text-body-sm text-ink-soft">{«Thoughts on this? I reply to everything.» / «对这篇文章有想法？每条消息我都会回复。»}</p>
  <ButtonGroup><Link href={contactHref} className="{Primary button}">{«Contact me» / «联系我»}<ArrowIcon /></Link></ButtonGroup>
</div>
```

### RelatedPosts ("You might also like")

Two posts: same topic first, newest first, then other topics. Never "Previous / Next".

```tsx
<section aria-labelledby="related-title" className="flex flex-col gap-4">
  <h2 id="related-title" className="font-display text-[28px] font-extrabold tracking-title">{«You might also like» / «你可能也会喜欢»}</h2>
  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
    <Link href={href} className="flex min-h-45 flex-col gap-3 rounded-md px-7 py-6 bg-top-right no-underline
                                 {1st: 'bg-night dots-on-night text-on-night' | 2nd: 'bg-marker dots-on-marker text-marker-ink'}">
      <span className="flex items-center justify-between gap-2.5 font-mono text-label uppercase">{topic} · {minutes}<span aria-hidden className="font-display text-[28px] normal-case tracking-normal leading-none">→</span></span>
      <span className="mt-auto font-display text-title-md">{title}</span>
    </Link>
  </div>
</section>
```

Post page `main` order and gaps: PostHeader → PostBody → HowWritten → SubscribePanel → PostActions → RelatedPosts, `gap-12`.

### AI disclosure

All writing is Vernon's ideas, shaped into finished sentences by AI and reviewed by him. The site says so in three places, always with the same wording from the dictionary:

**AiNote** (Writing index header, between the intro and the email button):

```tsx
<p className="flex max-w-[40ch] items-start gap-2.5 rounded-sm bg-sunken px-3.5 py-2.5 text-left text-meta leading-[1.55] text-ink-soft">
  <span aria-hidden className="mt-[5px] size-2 shrink-0 rounded-[2px] bg-marker" />
  <span><strong className="font-semibold text-ink">{«My ideas, polished with AI.» / «观点是我的，文字经 AI 润色。»}</strong> {«I write the thoughts and rough notes; AI shapes them…»}</span>
</p>
```

**AiTag** (last item in every post's PostMeta):

```tsx
<span className="rounded-xs bg-sunken px-2 py-0.5 font-mono text-label normal-case tracking-normal text-ink-soft">{«Polished with AI» / «AI 润色»}</span>
```

**HowWritten** (directly after the PostBody):

```tsx
<aside aria-label={«How this post was written»} className="flex max-w-reading items-start gap-3.5 rounded-md border border-dashed border-field-line bg-raised px-5 py-4.5">
  <span aria-hidden className="mt-1.5 size-2.5 shrink-0 rounded-[2px] bg-marker" />
  <div className="flex flex-col gap-1">
    <strong className="font-display text-lg font-bold">{«How this post was written» / «这篇文章是怎么写的»}</strong>
    <p className="text-body-sm text-ink-soft">{«The ideas, opinions and examples are mine…»}</p>
  </div>
</aside>
```

---

## Resume components

Rendered inside [ResumeLayout](#page-layouts). No highlighter, no dot patterns, no `bg-night` blocks: the page must print cleanly. The print variable block is in [pages.md](pages.md#resume-resume-zhresume).

**ResumeActions** (screen only):

```tsx
<nav aria-label={«Resume actions»} className="mb-12 flex flex-wrap items-center justify-between gap-3 print:hidden">
  <Link href={homeHref} className="inline-flex min-h-11 items-center font-mono text-meta text-ink-muted no-underline">← {«Back to home»}</Link>
  <a href={pdfHref} download={fileName} className="{Primary button}">{«Download PDF»}<DownloadIcon /></a>   {/* right-aligned; pdfHref = /resume.pdf or /zh/resume.pdf */}
</nav>
```

The browser print styles stay, so printing the page still works; the button gives the generated PDF ([pages.md](pages.md#resume-resume-zhresume)). DownloadIcon: viewBox 0 0 16 16, path `M8 2v8M4.5 6.5L8 10l3.5-3.5M3 13h10`.

**ResumeHeader**:

```tsx
<header className="flex flex-col gap-3 border-b-2 border-rule-strong pb-10 print:gap-[3pt] print:pb-[7pt]">
  <p className="font-mono text-label uppercase text-ink-muted print:hidden">{«Resume»}</p>
  <h1 className="font-display text-display-md print:text-[22pt] print:tracking-normal">Vernon Wee Hong <span className="text-ink">KOH</span></h1>
  <p className="font-display text-title-sm text-ink-soft print:text-[11pt]">{role}</p>
  <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 font-mono text-meta print:gap-x-[14pt] print:font-sans print:text-[8.5pt]">{links}</ul>
</header>
```

**ResumeSection** (Skills, Experience, Projects, Awards, Education):

```tsx
<section className="flex flex-col gap-6 print:gap-[6pt]">
	<h2 className="font-mono text-label uppercase text-ink-muted print:border-b print:border-rule print:pb-[2pt] print:font-sans print:text-[9pt] print:font-bold print:text-ink">
		{title}
	</h2>
	{children}
</section>
```

**ResumeRow** (every dated row; same 180px meta column as the homepage, the old 200px changes to 180px):

```tsx
<div className="flex flex-wrap gap-x-8 gap-y-2">
	<div className="flex-[0_0_180px] font-mono text-meta tabular-nums">
		{dates}
	</div>
	<div className="min-w-0 flex-[1_1_360px]">{children}</div>
</div>
```

What goes in the 180px column, following Vernon's resume PDF:

- Skills: the group name (`font-sans text-body-sm font-medium text-ink`); the right column lists the items joined with `, ` (Chinese: `、`) (`text-body-sm text-ink-soft`).
- Experience: role (`font-sans text-body-sm font-semibold text-ink`), company, then dates `{Apr 2020} – {Present}` built from the dictionary's `resume.month` / `resume.present`, in `<time dateTime>`. The right column is a `ul` of highlights, `m-0 flex list-disc flex-col gap-2 pl-4.5 text-body-sm text-ink-soft marker:text-ink-muted`.
- Projects: name (`font-sans text-body-sm font-semibold text-ink`) and, when present, its status in brackets; the right column is the description, `text-body-sm text-ink-soft`.

Awards and Education are single lines with the year or period right-aligned (`flex flex-wrap justify-between gap-x-6`). Highlights use `**…**` bold numbers like the homepage.

**ResumeSummary**: a ResumeSection titled `«Summary»` holding `<p className="max-w-measure text-body-sm text-ink">{summary}</p>`.

**ResumeUpdated**: `<p className="font-mono text-label normal-case tracking-normal text-ink-muted print:hidden">{«Last updated {date}»}</p>`.

---

## Not found components

**NotFoundMessage** (inside [NotFoundLayout](#page-layouts)):

```tsx
<>
  <p className="font-mono text-label uppercase text-ink-muted">{«404 · Not found»}</p>
  <h1 className="font-display text-display-xl">404<span className="text-marker [-webkit-text-stroke:2px_var(--ink)]">.</span></h1>
  <p className="max-w-measure text-lead text-ink-soft">{«The page you are looking for does not exist.»}</p>
  <ButtonGroup><Link href={homeHref} className="{Primary button}">{«Go back home»}<ArrowIcon /></Link></ButtonGroup>
</>
```

---

## Forms

All fields: visible `<label>` (never placeholder-only), `min-h-12`, `rounded-sm`, `text-base` (16px, avoids iOS zoom), `font-sans`.

### ContactForm (on the night panel)

```tsx
<form className="relative flex min-w-0 flex-[1_1_380px] flex-col gap-4">
  <div className="flex flex-wrap gap-4">
    <Field label={«Name»} name="name" autoComplete="name" />     {/* flex-[1_1_180px] */}
    <Field label={«Email»} name="email" type="email" autoComplete="email" />
  </div>
  <Field label={«Message»} name="message" as="textarea" rows={5} />
  <button type="submit" className="self-end {On-night submit}">{«Send message»}<ArrowIcon /></button>
</form>
```

Field on night: label `flex flex-col gap-1.5 text-body-sm font-medium`; input `box-border border border-night-line bg-transparent px-3.5 py-3 text-on-night placeholder:text-on-night-soft`; textarea adds `resize-y`. Keep the honeypot, the API route and the rate limit from the current site.

### SubscribeForm (on the marker panel)

```tsx
<form noValidate onSubmit={…} className="flex flex-col gap-2.5">
  <label htmlFor="subscribe-email" className="text-body-sm font-medium">{«Email address» / «邮箱地址»}</label>
  <div className="flex flex-wrap gap-2">
    <input id="subscribe-email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={error || undefined}
           className="box-border min-h-12 min-w-0 flex-[1_1_220px] rounded-sm border-2 border-marker-ink bg-raised px-3.5 font-sans text-base text-ink" />
    <button type="submit" className="ml-auto {On-marker submit}">{«Subscribe» / «订阅»}</button>
  </div>
  {error && <p role="alert" className="text-small font-semibold">{«Enter an email address like name@example.com.»}</p>}
  <p className="font-mono text-label normal-case tracking-normal leading-[1.6]">{«Your address is only used…»} <Link href={privacyHref} className="underline underline-offset-3">{«How I handle it»}</Link> · <Link href={feedHref} className="underline underline-offset-3">{«Prefer RSS?»}</Link></p>
</form>
```

There is no language choice in Phase 1: one free newsletter sends every post in both languages ([pages.md](pages.md#subscriptions)). Submits `{ email }` to our `/api/subscribe` route, which adds the address to Buttondown; success shows `SubscribeDone`.

---

## Icons

Inline SVG, stroke only, `fill-none stroke-current`, stroke width 1.5 (search: 1.75), round caps and joins, `aria-hidden` unless the icon is the only content of a control (then the control has `aria-label`). The set: moon, sun, arrow-right, arrow-up-right, mail, search, menu, close, RSS. No icon fonts, no emoji, no brand logos (GitHub/LinkedIn are text).

| Icon           | viewBox   | Path                                                                                                                       |
| -------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| moon           | 0 0 20 20 | `M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7z`                                                                          |
| sun            | 0 0 20 20 | `circle 10,10 r3.5` + `M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4` |
| arrow-right    | 0 0 16 16 | `M3 8h10M9 4l4 4-4 4`                                                                                                      |
| arrow-up-right | 0 0 16 16 | `M5 11l6-6M6 5h5v5`                                                                                                        |
| mail           | 0 0 16 16 | `rect 2,3.5 12×9 rx1.5` + `M2.5 4.5L8 9l5.5-4.5`                                                                           |
| search         | 0 0 24 24 | `circle 10.5,10.5 r6.5` + `M15.5 15.5L21 21`                                                                               |
| menu           | 0 0 20 20 | `M3 6h14M3 10h14M3 14h14`                                                                                                  |
| close          | 0 0 20 20 | `M5 5l10 10M15 5L5 15`                                                                                                     |
| rss            | 0 0 16 16 | `M3 3a10 10 0 0 1 10 10M3 7a6 6 0 0 1 6 6` + `circle 3.5,12.5 r1`                                                          |
