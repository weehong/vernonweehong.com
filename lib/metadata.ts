import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type PageMetadataOptions = {
	/** A plain string is suffixed by the root layout's title template. */
	readonly title: string | { readonly absolute: string };
	readonly description?: string;
	/** Root-relative path, e.g. "/resume". Also used as the canonical URL. */
	readonly path: string;
	readonly ogType?: "website" | "profile";
};

/**
 * Builds a page's metadata with a complete `openGraph` and `twitter` block.
 *
 * Next.js merges metadata shallowly: a page that sets `openGraph` replaces the
 * layout's whole object. Every page goes through this helper so shared fields
 * (site name, locale, ...) are never dropped.
 *
 * The share image is dropped too, so a route outside `app/` root also needs
 * `opengraph-image.tsx` / `twitter-image.tsx` files (see app/resume/).
 */
export function pageMetadata({
	title,
	description = siteConfig.description,
	path,
	ogType = "website",
}: PageMetadataOptions): Metadata {
	const socialTitle =
		typeof title === "string"
			? `${title} | ${siteConfig.siteName}`
			: title.absolute;
	const openGraph = {
		url: path,
		siteName: siteConfig.siteName,
		locale: siteConfig.locale,
		title: socialTitle,
		description,
	};

	return {
		title,
		description,
		alternates: { canonical: path },
		openGraph:
			ogType === "profile"
				? {
						...openGraph,
						type: "profile",
						firstName: siteConfig.givenName,
						lastName: siteConfig.familyName,
					}
				: { ...openGraph, type: "website" },
		twitter: {
			card: "summary_large_image",
			title: socialTitle,
			description,
		},
	};
}
