import type {
	BlogPosting,
	BreadcrumbList,
	CollectionPage,
	Graph,
	Person,
	ProfilePage,
	Thing,
	WebSite,
} from "schema-dts";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { htmlLang, localePath, type Locale } from "@/lib/i18n/locales";
import { getResume } from "@/lib/resume";
import { siteConfig } from "@/lib/site-config";
import type { Post } from "@/lib/writing/posts";

/**
 * JSON-LD per page and per edition (docs/design/pages.md, Metadata): one graph
 * with the shared WebSite and Person nodes plus the page's own nodes, every
 * node marked with its `inLanguage`.
 */

const url = (locale: Locale, path: string): string =>
	`${siteConfig.url}${localePath(locale, path)}`;
const websiteId = (locale: Locale): string => `${url(locale, "/")}#website`;
const personId = `${siteConfig.url}/#person`;

/** Names people search for. Structured data only: visible text always says KOH. */
const ALTERNATE_NAMES = [
	"Vernon KOH",
	"Vernon Koh",
	"Vernon Wee Hong Koh",
	"Koh Wee Hong",
	"Wee Hong",
];

function webSite(locale: Locale): WebSite {
	const dict = getDictionary(locale);
	return {
		"@type": "WebSite",
		"@id": websiteId(locale),
		url: url(locale, "/"),
		name: siteConfig.siteName,
		alternateName: ALTERNATE_NAMES,
		description: dict.meta.description,
		inLanguage: htmlLang(locale),
		publisher: { "@id": personId },
	};
}

function person(locale: Locale): Person {
	const resume = getResume(locale);
	const current = resume.experience.filter((job) => job.end === null);
	return {
		"@type": "Person",
		"@id": personId,
		name: siteConfig.author,
		alternateName: ALTERNATE_NAMES,
		givenName: siteConfig.givenName,
		additionalName: "Wee Hong",
		familyName: siteConfig.familyName,
		jobTitle: resume.header.title,
		description: resume.summary,
		url: url(locale, "/"),
		email: `mailto:${resume.header.email}`,
		sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
		homeLocation: {
			"@type": "Place",
			name: resume.header.location,
			address: { "@type": "PostalAddress", addressCountry: "SG" },
		},
		worksFor: current.map((job) => ({
			"@type": "Organization",
			name: job.company,
		})),
		alumniOf: resume.education.map((entry) => ({
			"@type": "CollegeOrUniversity",
			name: entry.school,
		})),
		knowsAbout: resume.skills.flatMap((skill) => skill.items),
		knowsLanguage: ["en", "zh"],
		award: resume.awards.map((award) => `${award.title} (${award.year})`),
	};
}

function breadcrumb(
	locale: Locale,
	path: string,
	trail: ReadonlyArray<{ name: string; path: string }>
): BreadcrumbList {
	return {
		"@type": "BreadcrumbList",
		"@id": `${url(locale, path)}#breadcrumb`,
		itemListElement: trail.map((step, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: step.name,
			item: url(locale, step.path),
		})),
	};
}

function graph(locale: Locale, ...nodes: ReadonlyArray<Thing>): Graph {
	return {
		"@context": "https://schema.org",
		"@graph": [webSite(locale), person(locale), ...nodes],
	};
}

/** Homepage: a profile page about the owner. */
export function homeGraph(locale: Locale): Graph {
	const page: ProfilePage = {
		"@type": "ProfilePage",
		"@id": `${url(locale, "/")}#profilepage`,
		url: url(locale, "/"),
		name: getDictionary(locale).meta.title,
		inLanguage: htmlLang(locale),
		dateModified: getResume(locale).updated,
		isPartOf: { "@id": websiteId(locale) },
		mainEntity: { "@id": personId },
		about: { "@id": personId },
	};
	return graph(locale, page);
}

/** /resume: a profile page with its breadcrumb. */
export function resumeGraph(locale: Locale): Graph {
	const dict = getDictionary(locale);
	const resume = getResume(locale);
	const page: ProfilePage = {
		"@type": "ProfilePage",
		"@id": `${url(locale, "/resume")}#webpage`,
		url: url(locale, "/resume"),
		name: `${dict.resume.kicker} · ${siteConfig.siteName}`,
		description: resume.meta.description,
		inLanguage: htmlLang(locale),
		dateModified: resume.updated,
		isPartOf: { "@id": websiteId(locale) },
		mainEntity: { "@id": personId },
		breadcrumb: { "@id": `${url(locale, "/resume")}#breadcrumb` },
	};
	return graph(
		locale,
		page,
		breadcrumb(locale, "/resume", [
			{ name: dict.home, path: "/" },
			{ name: dict.resume.kicker, path: "/resume" },
		])
	);
}

/** Writing index: a collection of the edition's posts. */
export function writingGraph(
	locale: Locale,
	posts: ReadonlyArray<Post>
): Graph {
	const dict = getDictionary(locale);
	const page: CollectionPage = {
		"@type": "CollectionPage",
		"@id": `${url(locale, "/writing")}#webpage`,
		url: url(locale, "/writing"),
		name: `${dict.writing} · ${siteConfig.shortName}`,
		description: dict.meta.writingDescription,
		inLanguage: htmlLang(locale),
		isPartOf: { "@id": websiteId(locale) },
		author: { "@id": personId },
		hasPart: posts.map((post) => ({
			"@id": `${url(locale, `/writing/${post.slug}`)}#article`,
		})),
	};
	return graph(locale, page);
}

/** A post: a BlogPosting by the owner, with its breadcrumb. */
export function postGraph(locale: Locale, post: Post): Graph {
	const dict = getDictionary(locale);
	const path = `/writing/${post.slug}`;
	const article: BlogPosting = {
		"@type": "BlogPosting",
		"@id": `${url(locale, path)}#article`,
		url: url(locale, path),
		mainEntityOfPage: url(locale, path),
		headline: post.title,
		description: post.summary,
		inLanguage: htmlLang(locale),
		datePublished: post.publishedOn,
		dateModified: post.updatedOn ?? post.publishedOn,
		articleSection: dict.topics[post.topic],
		timeRequired: `PT${post.minutes}M`,
		image: `${url(locale, path)}/opengraph-image`,
		author: { "@id": personId },
		publisher: { "@id": personId },
		isPartOf: { "@id": websiteId(locale) },
	};
	return graph(
		locale,
		article,
		breadcrumb(locale, path, [
			{ name: dict.home, path: "/" },
			{ name: dict.writing, path: "/writing" },
			{ name: post.title, path },
		])
	);
}
