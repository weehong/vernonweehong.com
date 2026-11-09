import type { MetadataRoute } from "next";
import { alternatesFor, localePath, locales } from "@/lib/i18n/locales";
import { siteConfig } from "@/lib/site-config";
import { getResume } from "@/lib/resume";
import { getPosts } from "@/lib/writing/posts";

/** Both editions, each page with its language alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
	const updated = getResume("en").updated;
	const posts = getPosts("en");
	const newest = posts[0]?.publishedOn ?? updated;
	const pages: Array<{ path: string; lastModified: string }> = [
		{ path: "/", lastModified: updated },
		{ path: "/resume", lastModified: updated },
		{ path: "/writing", lastModified: newest },
		...posts.map((post) => ({
			path: `/writing/${post.slug}`,
			lastModified: post.updatedOn ?? post.publishedOn,
		})),
	];
	return pages.flatMap(({ path, lastModified }) =>
		locales.map((locale) => {
			const alternates = alternatesFor(path);
			return {
				url: `${siteConfig.url}${localePath(locale, path)}`,
				lastModified,
				alternates: {
					languages: {
						en: `${siteConfig.url}${alternates.en}`,
						"zh-Hans": `${siteConfig.url}${alternates["zh-Hans"]}`,
						"x-default": `${siteConfig.url}${alternates["x-default"]}`,
					},
				},
			};
		})
	);
}
