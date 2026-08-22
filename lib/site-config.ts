/**
 * Central SEO / site configuration. Single source of truth imported by the
 * metadata, robots, sitemap, manifest, OG-image and structured-data modules.
 *
 * Edit these values to brand the boilerplate.
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

export const siteConfig = {
	/** Full brand / site name — used as the default <title> and OG site name. */
	name: "Vernon Wee Hong KOH | Backend Engineer",
	/** Short name for the web app manifest (home-screen label). */
	shortName: "Vernon KOH",
	/** Default meta description. */
	description:
		"Backend engineer in Singapore building production REST services, integration workflows, and regulated-market API platforms.",
	/** Absolute canonical origin (no trailing slash). */
	url: process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_URL,
	/** Open Graph locale. */
	locale: "en_SG",
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
	location: "Singapore",
	socialLinks: [
		"https://github.com/weehong",
		"https://www.linkedin.com/in/weehongkoh/",
		"https://www.youtube.com/@weehongayden90",
	],
	/** Alt text for the default OG/Twitter image. */
	ogImageAlt: "Vernon Wee Hong KOH, Backend Engineer in Singapore",
	/** theme-color values, kept in sync with app/globals.css. */
	themeColor: {
		light: "#f1faee",
		dark: "#132339",
	},
} as const;

export type SiteConfig = typeof siteConfig;
