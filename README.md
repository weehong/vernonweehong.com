# Vernon Koh Portfolio

Personal portfolio for Vernon Wee Hong KOH, a backend engineer based in Singapore. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Set these environment variables for a production deployment:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_APP_ENVIRONMENT=production
```

Only deployments with `NEXT_PUBLIC_APP_ENVIRONMENT=production` allow search engine indexing.

The contact form sends mail over SMTP. Copy `.env.example` and set:

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=vernonweehongkoh@outlook.com
SMTP_PASSWORD=your-app-password
CONTACT_TO=vernonweehongkoh@outlook.com
```

For a personal Outlook account, use an [app password](https://support.microsoft.com/account-billing/manage-app-passwords-for-two-step-verification-d6dc8c6d-4bf7-4851-ad3e-5b3c0d0c0c8e) if two-step verification is on, and keep SMTP AUTH enabled. The authenticated mailbox (`SMTP_USER`) is the From address; visitors' addresses go in Reply-To.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run test:unit:run
npm run build
npm run test:e2e
```
