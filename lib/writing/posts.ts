import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/lib/i18n/locales";
import { isProductionEnv } from "@/lib/site-config";
import {
	checkPair,
	checkPostSource,
	headingsOf,
	plainText,
	readingMinutes,
	type Heading,
	type PostSource,
	type Topic,
} from "@/lib/writing/post-check";

export type { Heading, Topic } from "@/lib/writing/post-check";

/** One post in one edition, ready to render. */
export type Post = PostSource & {
	readonly locale: Locale;
	/** Archive number: position by publishedOn, oldest = 1. Same in both editions. */
	readonly no: number;
	readonly minutes: number;
	readonly headings: ReadonlyArray<Heading>;
	/** Plain text body for search. */
	readonly text: string;
};

const WRITING_DIR = join(process.cwd(), "content", "writing");

function readEdition(locale: Locale): Map<string, string> {
	const directory = join(WRITING_DIR, locale);
	if (!existsSync(directory)) return new Map();
	return new Map(
		readdirSync(directory)
			.filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
			.map((file) => [
				file.slice(0, -4),
				readFileSync(join(directory, file), "utf8"),
			])
	);
}

/**
 * Reads and checks every post. Any problem stops the build, so a broken post
 * or a post without its other language never reaches the site.
 */
function loadPosts(): Record<Locale, ReadonlyArray<Post>> {
	const sources = { en: readEdition("en"), zh: readEdition("zh") };
	const problems: Array<string> = [];
	const parsed: Record<Locale, Map<string, PostSource>> = {
		en: new Map(),
		zh: new Map(),
	};

	for (const locale of ["en", "zh"] as const) {
		for (const [slug, source] of sources[locale]) {
			const { post, errors } = checkPostSource(slug, locale, source);
			problems.push(
				...errors.map(
					(error) => `content/writing/${locale}/${slug}.mdx: ${error}`
				)
			);
			if (post) parsed[locale].set(slug, post);
		}
	}
	const slugs = new Set([...sources.en.keys(), ...sources.zh.keys()]);
	for (const slug of slugs) {
		if (!sources.en.has(slug))
			problems.push(
				`content/writing/en/${slug}.mdx is missing (every post needs both languages)`
			);
		if (!sources.zh.has(slug))
			problems.push(
				`content/writing/zh/${slug}.mdx is missing (every post needs both languages)`
			);
		const en = parsed.en.get(slug);
		const zh = parsed.zh.get(slug);
		if (en && zh) problems.push(...checkPair(en, zh));
	}
	if (problems.length > 0) {
		throw new Error(`Posts need fixing:\n${problems.join("\n")}`);
	}

	// A post shows only when both languages are published (drafts outside production).
	const visible = [...parsed.en.values()]
		.filter((en) => {
			const zh = parsed.zh.get(en.slug);
			if (!zh) return false;
			return (
				!isProductionEnv ||
				(en.status === "published" && zh.status === "published")
			);
		})
		.toSorted(
			(a, b) =>
				a.publishedOn.localeCompare(b.publishedOn) ||
				a.slug.localeCompare(b.slug)
		);
	const numbers = new Map(visible.map((post, index) => [post.slug, index + 1]));

	const build = (locale: Locale): ReadonlyArray<Post> =>
		visible
			.map((en): Post => {
				const source =
					locale === "en" ? en : (parsed.zh.get(en.slug) as PostSource);
				return {
					...source,
					locale,
					no: numbers.get(en.slug) ?? 0,
					minutes: readingMinutes(source.body),
					headings: headingsOf(source.body),
					text: plainText(source.body),
				};
			})
			.toReversed();

	return { en: build("en"), zh: build("zh") };
}

const POSTS = loadPosts();

/** Posts of an edition, newest first. */
export function getPosts(locale: Locale): ReadonlyArray<Post> {
	return POSTS[locale];
}

export function getPost(locale: Locale, slug: string): Post | undefined {
	return POSTS[locale].find((post) => post.slug === slug);
}

/** "06", "12": the archive number, zero-padded to two digits. */
export function postNumber(no: number): string {
	return String(no).padStart(2, "0");
}

/** Two related posts: same topic first (newest first), then other topics. */
export function relatedPosts(post: Post): ReadonlyArray<Post> {
	const others = POSTS[post.locale].filter((other) => other.slug !== post.slug);
	return [
		...others.filter((other) => other.topic === post.topic),
		...others.filter((other) => other.topic !== post.topic),
	].slice(0, 2);
}

/** The search index for an edition (docs/design/pages.md, Search). */
export type SearchEntry = {
	readonly slug: string;
	readonly no: number;
	readonly title: string;
	readonly summary: string;
	readonly topic: Topic;
	readonly topicName: string;
	readonly publishedOn: string;
	readonly minutes: number;
	readonly body: string;
};

export function searchIndex(
	locale: Locale,
	topicNames: Record<Topic, string>
): Array<SearchEntry> {
	return POSTS[locale].map((post) => ({
		slug: post.slug,
		no: post.no,
		title: post.title,
		summary: post.summary,
		topic: post.topic,
		topicName: topicNames[post.topic],
		publishedOn: post.publishedOn,
		minutes: post.minutes,
		body: post.text,
	}));
}
