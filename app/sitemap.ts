import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Generates /sitemap.xml. Add an entry per indexable route. `lastModified`
// is a fixed content date (bump `siteConfig.lastModified` on real changes)
// so crawlers can trust it.
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: siteConfig.url,
			lastModified: siteConfig.lastModified,
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${siteConfig.url}/resume`,
			lastModified: siteConfig.lastModified,
			changeFrequency: "monthly",
			priority: 0.8,
		},
	];
}
