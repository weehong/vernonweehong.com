import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Generates /manifest.webmanifest. Icons point at the generated /icon/<size>
// (see app/icon.tsx) and /apple-icon routes.
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteConfig.siteName,
		short_name: siteConfig.shortName,
		description: siteConfig.description,
		start_url: "/",
		display: "standalone",
		background_color: siteConfig.themeColor.light,
		theme_color: siteConfig.themeColor.light,
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
