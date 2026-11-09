/**
 * Client-side search over an edition's search index (docs/design/pages.md,
 * Search). Pure functions: the Writing index runs them in the browser.
 */

export type SearchablePost = {
	readonly slug: string;
	readonly no: number;
	readonly title: string;
	readonly summary: string;
	readonly topic: "tech" | "reflections";
	readonly topicName: string;
	readonly publishedOn: string;
	readonly minutes: number;
	readonly body: string;
};

export type Field = "title" | "summary" | "topic" | "text";

/** Text split into plain and highlighted parts. */
export type Part = { readonly text: string; readonly hit: boolean };

export type SearchResult = {
	readonly post: SearchablePost;
	readonly score: number;
	readonly where: ReadonlyArray<Field>;
	readonly title: ReadonlyArray<Part>;
	/** The summary with hits, or a snippet around the first body hit. */
	readonly line: ReadonlyArray<Part>;
};

type Range = readonly [start: number, end: number];

const WEIGHT: Record<Field, number> = {
	title: 3,
	summary: 2,
	topic: 2,
	text: 1,
};

export function tokenize(query: string): Array<string> {
	return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function editDistance(a: string, b: string): number {
	const row = Array.from({ length: b.length + 1 }, (_, index) => index);
	for (let aIndex = 1; aIndex <= a.length; aIndex += 1) {
		let previous = row[0] ?? 0;
		row[0] = aIndex;
		for (let bIndex = 1; bIndex <= b.length; bIndex += 1) {
			const current = row[bIndex] ?? 0;
			row[bIndex] = Math.min(
				current + 1,
				(row[bIndex - 1] ?? 0) + 1,
				previous + (a[aIndex - 1] === b[bIndex - 1] ? 0 : 1)
			);
			previous = current;
		}
	}
	return row[b.length] ?? 0;
}

function exactRanges(haystack: string, token: string): Array<Range> {
	const ranges: Array<Range> = [];
	const lower = haystack.toLowerCase();
	let index = lower.indexOf(token);
	while (index !== -1) {
		ranges.push([index, index + token.length]);
		index = lower.indexOf(token, index + token.length);
	}
	return ranges;
}

/** Latin tokens of 3+ letters: words within edit distance 1 (2 for 6+). */
function fuzzyRanges(haystack: string, token: string): Array<Range> {
	if (token.length < 3 || !/^[a-z0-9'’-]+$/.test(token)) return [];
	const limit = token.length >= 6 ? 2 : 1;
	const ranges: Array<Range> = [];
	for (const match of haystack.matchAll(/[A-Za-z0-9'’-]+/g)) {
		const word = match[0].toLowerCase();
		if (
			editDistance(word, token) <= limit ||
			editDistance(word.slice(0, token.length), token) <= limit
		) {
			const start = match.index;
			ranges.push([start, start + match[0].length]);
		}
	}
	return ranges;
}

function merge(ranges: ReadonlyArray<Range>): Array<Range> {
	const sorted = ranges.toSorted((a, b) => a[0] - b[0]);
	const merged: Array<[number, number]> = [];
	for (const [start, end] of sorted) {
		const last = merged.at(-1);
		if (last && start <= last[1]) last[1] = Math.max(last[1], end);
		else merged.push([start, end]);
	}
	return merged;
}

export function toParts(
	text: string,
	ranges: ReadonlyArray<Range>
): Array<Part> {
	const parts: Array<Part> = [];
	let cursor = 0;
	for (const [start, end] of merge(ranges)) {
		if (start > cursor)
			parts.push({ text: text.slice(cursor, start), hit: false });
		parts.push({ text: text.slice(start, end), hit: true });
		cursor = end;
	}
	if (cursor < text.length)
		parts.push({ text: text.slice(cursor), hit: false });
	return parts;
}

function snippet(
	body: string,
	ranges: ReadonlyArray<Range>,
	chinese: boolean
): Array<Part> {
	const first = merge(ranges)[0];
	if (!first) return [{ text: body.slice(0, chinese ? 90 : 170), hit: false }];
	const [before, after] = chinese ? [30, 60] : [60, 110];
	const start = Math.max(0, first[0] - before);
	const end = Math.min(body.length, first[1] + after);
	const inside = ranges
		.filter(([from, to]) => from >= start && to <= end)
		.map(([from, to]): Range => [from - start, to - start]);
	const parts = toParts(body.slice(start, end), inside);
	return [
		...(start > 0 ? [{ text: "…", hit: false }] : []),
		...parts,
		...(end < body.length ? [{ text: "…", hit: false }] : []),
	];
}

/** Every token must match; results sorted by score, then newest. */
export function search(
	posts: ReadonlyArray<SearchablePost>,
	query: string,
	chinese: boolean
): Array<SearchResult> {
	const tokens = tokenize(query);
	if (tokens.length === 0) return [];
	const results: Array<SearchResult> = [];

	for (const post of posts) {
		const fields: Record<Field, string> = {
			title: post.title,
			summary: post.summary,
			topic: post.topicName,
			text: post.body,
		};
		const hits: Record<Field, Array<Range>> = {
			title: [],
			summary: [],
			topic: [],
			text: [],
		};
		let score = 0;
		let everyToken = true;

		for (const token of tokens) {
			let matched = false;
			for (const field of Object.keys(fields) as Array<Field>) {
				const exact = exactRanges(fields[field], token);
				const ranges =
					exact.length > 0 ? exact : fuzzyRanges(fields[field], token);
				if (ranges.length > 0) {
					matched = true;
					hits[field].push(...ranges);
					score += WEIGHT[field] * (exact.length > 0 ? 2 : 1);
				}
			}
			if (!matched) {
				everyToken = false;
				break;
			}
		}
		if (!everyToken) continue;

		const where = (["title", "text", "summary", "topic"] as const).filter(
			(field) => hits[field].length > 0
		);
		const line =
			hits.summary.length > 0 || hits.text.length === 0
				? toParts(post.summary, hits.summary)
				: snippet(post.body, hits.text, chinese);
		results.push({
			post,
			score,
			where,
			title: toParts(post.title, hits.title),
			line,
		});
	}

	return results.toSorted(
		(a, b) =>
			b.score - a.score || b.post.publishedOn.localeCompare(a.post.publishedOn)
	);
}
