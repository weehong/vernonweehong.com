import type { MetadataRoute } from "next";
import { isProductionEnv, siteConfig } from "@/lib/site-config";

/** Crawlers only in production; every other environment is blocked. */
export default function robots(): MetadataRoute.Robots {
	return isProductionEnv
		? {
				rules: { userAgent: "*", allow: "/" },
				sitemap: `${siteConfig.url}/sitemap.xml`,
			}
		: { rules: { userAgent: "*", disallow: "/" } };
}
