import type { MetadataRoute } from "next";
import { lightTokens } from "@/lib/design-tokens";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site-config";

/** /manifest.webmanifest: name, colours and the VK icons. */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteConfig.siteName,
		short_name: siteConfig.shortName,
		description: getDictionary("en").meta.description,
		start_url: "/",
		display: "standalone",
		background_color: lightTokens.paper,
		theme_color: lightTokens.paper,
		icons: [
			{ src: "/icon/192", sizes: "192x192", type: "image/png" },
			{ src: "/icon/512", sizes: "512x512", type: "image/png" },
			{
				src: "/icon/512",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
			{ src: "/apple-icon", sizes: "180x180", type: "image/png" },
		],
	};
}
