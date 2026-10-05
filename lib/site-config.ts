/**
 * Central SEO / site configuration. Single source of truth imported by the
 * metadata, robots, sitemap, manifest, OG-image and structured-data modules.
 *
 * Portfolio content (experience, skills, ...) lives in `lib/profile.ts`.
 */

const DEFAULT_URL = "http://localhost:3000";

const appEnvironment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT ?? "development";

/**
 * Search-engine indexing is enabled **only in production**. In every other
 * environment (development, preview, staging) crawlers are blocked via
 * `robots.txt` and pages emit `noindex, nofollow`, so non-production
 * deployments are never indexed.
 */
export const isProductionEnv: boolean = appEnvironment === "production";

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

// A production build without a site URL would emit localhost canonicals,
// OG URLs and sitemap entries, so fail the build instead.
if (isProductionEnv && !configuredUrl) {
	throw new Error(
		"NEXT_PUBLIC_SITE_URL must be set when NEXT_PUBLIC_APP_ENVIRONMENT=production."
	);
}

export const siteConfig = {
	/** Site name — og:site_name, WebSite schema name and the title suffix. */
	siteName: "Vernon Wee Hong KOH",
	/** Homepage <title>. */
	title: "Vernon Wee Hong KOH — Backend Engineer in Singapore",
	/** Short name for the web app manifest (home-screen label). */
	shortName: "Vernon KOH",
	/** Default meta description. */
	description:
		"Vernon Koh is a backend engineer in Singapore building Java and Spring Boot REST services, integration workflows and regulated-market API platforms.",
	/**
	 * Absolute canonical origin (no trailing slash). `||` so an empty value,
	 * e.g. an unset Docker build arg, falls back to the default.
	 */
	url: (configuredUrl || DEFAULT_URL).replace(/\/+$/, ""),
	/** Open Graph locale. */
	locale: "en_SG",
	/** BCP 47 language tag for structured data. */
	language: "en-SG",
	/** Default keywords. */
	keywords: [
		"Vernon Koh",
		"Backend Engineer",
		"Java",
		"Spring Boot",
		"TypeScript",
		"REST API",
		"Singapore",
	],
	/** Author / creator attribution. */
	author: "Vernon Wee Hong KOH",
	creator: "Vernon Wee Hong KOH",
	/** Other names people search for; emitted as Person `alternateName`. */
	alternateNames: [
		"Vernon Koh",
		"Vernon Wee Hong Koh",
		"Wee Hong Koh",
		"Koh Wee Hong",
	],
	givenName: "Vernon",
	additionalName: "Wee Hong",
	familyName: "Koh",
	jobTitle: "Backend Engineer",
	location: "Singapore",
	/** Absolute or root-relative headshot URL. Unset until a photo exists. */
	image: undefined as string | undefined,
	/** Last meaningful content change (ISO date). Bump when content changes. */
	lastModified: "2026-10-05",
	/** Alt text for the default OG/Twitter image. */
	ogImageAlt: "Vernon Wee Hong KOH, Backend Engineer in Singapore",
	/** theme-color values, kept in sync with app/globals.css. */
	themeColor: {
		light: "#f1faee",
		dark: "#132339",
	},
} as const;

export type SiteConfig = typeof siteConfig;
