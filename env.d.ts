// Type the environment variables this app reads so `process.env.X` dot-access
// is allowed under `noPropertyAccessFromIndexSignature` and Next.js keeps
// inlining the `NEXT_PUBLIC_` vars at build time.
declare namespace NodeJS {
	interface ProcessEnv {
		/** Absolute canonical site URL, e.g. https://example.com (no trailing slash). */
		readonly NEXT_PUBLIC_SITE_URL?: string;
		/** App environment label surfaced to the client. */
		readonly NEXT_PUBLIC_APP_ENVIRONMENT?: string;
		/** SMTP host for the contact form (default smtp-mail.outlook.com). */
		readonly SMTP_HOST?: string;
		/** SMTP port (default 587). */
		readonly SMTP_PORT?: string;
		/** SMTP username, typically the Outlook address. */
		readonly SMTP_USER?: string;
		/** SMTP password or app password. */
		readonly SMTP_PASSWORD?: string;
		/** Inbox that receives contact-form messages. */
		readonly CONTACT_TO?: string;
	}
}
