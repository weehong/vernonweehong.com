import type { ElsewhereItem } from "@/components/layout/link-column";
import type { PageLinks } from "@/components/layout/page-shell";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localePath, type Locale } from "@/lib/i18n/locales";
import type { Profile } from "@/lib/profile";
import { siteConfig } from "@/lib/site-config";

/** Link column for the homepage (docs/design/pages.md, Homepage). */
export function homeLinks(profile: Profile, dictionary: Dictionary): PageLinks {
	const ids = ["about", "experience", "projects", "skills", "contact"] as const;
	return {
		sections: ids.map((id) => ({ id, label: dictionary.sections[id] })),
		links: profile.linkColumn.elsewhere.map((link): ElsewhereItem => ({
			href: link.href,
			label: link.label,
			glyph: link.glyph === "↗" ? "↗" : "→",
		})),
	};
}

/** Link column for the Writing index. */
export function writingLinks(
	locale: Locale,
	dictionary: Dictionary
): PageLinks {
	return {
		sections: [
			{ id: "search", label: dictionary.nav.search },
			{ id: "latest", label: dictionary.nav.latest },
			{ id: "topics", label: dictionary.nav.topics },
			{ id: "archive", label: dictionary.nav.archive },
		],
		links: [
			{ href: localePath(locale, "/"), label: dictionary.home, glyph: "←" },
			{
				href: localePath(locale, "/resume"),
				label: dictionary.resume.kicker,
				glyph: "→",
			},
			{
				href: localePath(locale, "/feed.xml"),
				label: dictionary.rss,
				glyph: "↗",
			},
			{ href: siteConfig.links.github, label: "GitHub", glyph: "↗" },
			{ href: siteConfig.links.linkedin, label: "LinkedIn", glyph: "↗" },
		],
	};
}

/** Link column for a post: one item per `##` section. */
export function postLinks(
	locale: Locale,
	dictionary: Dictionary,
	headings: ReadonlyArray<{ readonly id: string; readonly text: string }>
): PageLinks {
	return {
		title: dictionary.onThisPost,
		sections: headings.map((heading) => ({
			id: heading.id,
			label: heading.text,
		})),
		links: [
			{
				href: localePath(locale, "/writing"),
				label: dictionary.allWriting,
				glyph: "←",
			},
			{ href: localePath(locale, "/"), label: dictionary.home, glyph: "←" },
			{
				href: localePath(locale, "/feed.xml"),
				label: dictionary.rss,
				glyph: "↗",
			},
			{ href: siteConfig.links.github, label: "GitHub", glyph: "↗" },
		],
	};
}
