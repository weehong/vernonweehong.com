# Vernon KOH Portfolio

Personal site for Vernon Wee Hong KOH, a backend engineer based in Singapore. Built with Next.js 16, React 19, TypeScript and Tailwind CSS v4.

The site is being rebuilt from a fresh Next.js app. What to build is fully specified in [`docs/design/`](docs/design/README.md): read that first.

- [`docs/design/README.md`](docs/design/README.md): stack, hard rules and the definition of done.
- [`docs/design/theme.css`](docs/design/theme.css): every design token as a Tailwind v4 theme, to paste into `app/globals.css`.
- [`docs/design/components.md`](docs/design/components.md): every component with its exact Tailwind classes.
- [`docs/design/pages.md`](docs/design/pages.md): English (`/`) and Chinese (`/zh`) editions, interface text, posts, search, email updates, page layouts.
- [`docs/design/copywriting/home.json`](docs/design/copywriting/home.json): the approved homepage copy in both languages.

## Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run test:unit:run
npm run build
npm run test:e2e
```

Commit messages follow Conventional Commits (checked by commitlint in a Git hook).
