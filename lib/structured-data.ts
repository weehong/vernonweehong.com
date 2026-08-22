import type { Person, WebSite, WithContext } from "schema-dts";
import { siteConfig } from "@/lib/site-config";

/** Site-wide WebSite schema (enables sitelinks search box eligibility). */
export function getWebSiteSchema(): WithContext<WebSite> {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
	};
}

/** Site-wide Person schema for the portfolio owner. */
export function getPersonSchema(): WithContext<Person> {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: siteConfig.author,
		jobTitle: "Backend Engineer",
		homeLocation: siteConfig.location,
		sameAs: [...siteConfig.socialLinks],
		url: siteConfig.url,
	};
}
