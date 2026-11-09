import type { Metadata, Viewport } from "next";
import { darkTokens, lightTokens } from "@/lib/design-tokens";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
	alternatesFor,
	localePath,
	ogLocale,
	type Locale,
} from "@/lib/i18n/locales";
import { isProductionEnv, siteConfig } from "@/lib/site-config";

export const siteViewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: lightTokens.paper },
		{ media: "(prefers-color-scheme: dark)", color: darkTokens.paper },
	],
};

/** Defaults for every page of an edition (root layout). */
export function siteMetadata(locale: Locale): Metadata {
	const dict = getDictionary(locale);
	return {
		metadataBase: new URL(siteConfig.url),
		title: {
			default: dict.meta.title,
			template: `%s · ${siteConfig.shortName}`,
		},
		description: dict.meta.description,
		applicationName: siteConfig.shortName,
		formatDetection: { telephone: false, email: false, address: false },
		...(siteConfig.googleVerification
			? { verification: { google: siteConfig.googleVerification } }
			: {}),
		authors: [{ name: siteConfig.author }],
		creator: siteConfig.author,
		robots: isProductionEnv
			? { index: true, follow: true }
			: { index: false, follow: false },
		alternates: {
			types: {
				"application/rss+xml": localePath(locale, "/feed.xml"),
			},
		},
	};
}

type PageMetadataOptions = {
	readonly locale: Locale;
	/** A plain string gets the site suffix; `absolute` is used as it is. */
	readonly title: string | { readonly absolute: string };
	readonly description: string;
	/** Unprefixed English path ("/", "/writing/slug"). */
	readonly path: string;
	readonly type?: "website" | "article";
	readonly publishedTime?: string;
	readonly modifiedTime?: string;
	/** Article section (the post topic). */
	readonly section?: string;
};

/**
 * A page's metadata with canonical URL, language alternates and complete Open
 * Graph and Twitter blocks (Next.js merges metadata shallowly, so every page
 * goes through here and nothing shared is dropped).
 */
export function pageMetadata({
	locale,
	title,
	description,
	path,
	type = "website",
	publishedTime,
	modifiedTime,
	section,
}: PageMetadataOptions): Metadata {
	const socialTitle =
		typeof title === "string"
			? `${title} · ${siteConfig.shortName}`
			: title.absolute;
	const url = localePath(locale, path);
	return {
		title,
		description,
		alternates: {
			canonical: url,
			languages: alternatesFor(path),
			types: { "application/rss+xml": localePath(locale, "/feed.xml") },
		},
		openGraph: {
			type,
			url,
			siteName: siteConfig.siteName,
			locale: ogLocale(locale),
			alternateLocale: [ogLocale(locale === "en" ? "zh" : "en")],
			title: socialTitle,
			description,
			...(type === "article"
				? {
						publishedTime,
						modifiedTime,
						section,
						authors: [`${siteConfig.url}${localePath(locale, "/")}`],
					}
				: {}),
		},
		twitter: { card: "summary_large_image", title: socialTitle, description },
	};
}
