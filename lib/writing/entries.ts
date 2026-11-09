import type { ArchiveEntry } from "@/components/writing/archive-entry";
import type { RelatedPost } from "@/components/post/related-posts";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill, formatDate, localePath, type Locale } from "@/lib/i18n/locales";
import { postNumber, type Post } from "@/lib/writing/posts";

export function postHref(locale: Locale, slug: string): string {
	return localePath(locale, `/writing/${slug}`);
}

/** A post with its display strings, for the Writing index. */
export function archiveEntry(post: Post, dictionary: Dictionary): ArchiveEntry {
	return {
		slug: post.slug,
		no: post.no,
		title: post.title,
		summary: post.summary,
		topic: post.topic,
		topicName: dictionary.topics[post.topic],
		publishedOn: post.publishedOn,
		minutes: post.minutes,
		href: postHref(post.locale, post.slug),
		date: formatDate(post.locale, post.publishedOn),
		minutesLabel: fill(dictionary.minutes, { n: post.minutes }),
		number: postNumber(post.no),
	};
}

export function relatedEntry(post: Post, dictionary: Dictionary): RelatedPost {
	return {
		href: postHref(post.locale, post.slug),
		title: post.title,
		topicName: dictionary.topics[post.topic],
		minutesLabel: fill(dictionary.minutes, { n: post.minutes }),
	};
}
