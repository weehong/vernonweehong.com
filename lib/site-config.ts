/**
 * Site-wide settings shared by metadata, robots, sitemap, feeds, share images
 * and structured data. Page text lives in the dictionaries and lib/profile.
 */

const DEFAULT_URL = "http://localhost:3000";

// An explicit NEXT_PUBLIC_APP_ENVIRONMENT wins; otherwise a Vercel production
// deployment counts as production.
const appEnvironment =
	process.env.NEXT_PUBLIC_APP_ENVIRONMENT ??
	(process.env.VERCEL_ENV === "production" ? "production" : "development");

/** Indexing, and published-only posts, are production-only. */
export const isProductionEnv: boolean = appEnvironment === "production";

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (isProductionEnv && !configuredUrl) {
	throw new Error(
		"NEXT_PUBLIC_SITE_URL must be set for production builds (NEXT_PUBLIC_APP_ENVIRONMENT=production or VERCEL_ENV=production)."
	);
}

export const siteConfig = {
	/** og:site_name and the title suffix. Surname always in capitals. */
	siteName: "Vernon Wee Hong KOH",
	shortName: "Vernon KOH",
	author: "Vernon Wee Hong KOH",
	/** Absolute canonical origin, no trailing slash. */
	url: (configuredUrl || DEFAULT_URL).replace(/\/+$/, ""),
	givenName: "Vernon",
	familyName: "KOH",
	/** Google Search Console HTML-tag verification code, if set. */
	googleVerification:
		process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined,
	links: {
		github: "https://github.com/weehong",
		linkedin: "https://sg.linkedin.com/in/vernonweehong",
	},
} as const;

/** Year shown in the footer, fixed at build time. */
export const copyrightYear: number = new Date().getUTCFullYear();
