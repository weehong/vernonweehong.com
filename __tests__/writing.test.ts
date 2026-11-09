import { describe, expect, it } from "vitest";
import { fill, formatDate, localePath } from "@/lib/i18n/locales";
import {
	checkPair,
	checkPostSource,
	headingsOf,
	readingMinutes,
} from "@/lib/writing/post-check";
import { search, type SearchablePost } from "@/lib/writing/search";

const front = (fields: Record<string, string>): string =>
	`---\n${Object.entries(fields)
		.map(([key, value]) => `${key}: ${value}`)
		.join("\n")}\n---\n`;

const valid = {
	title: '"Reviewing AI-written code: what I check first"',
	highlight: '"what I check first"',
	summary: '"A short checklist."',
	standfirst: '"Contract first."',
	topic: "tech",
	publishedOn: "2026-09-09",
	status: "published",
};
const body =
	"Intro line.\n\n## The contract\n\nText.\n\n## The failure modes\n\nMore text.\n";

describe("post checks", () => {
	it("accepts a valid post", () => {
		const { post, errors } = checkPostSource(
			"review",
			"en",
			front(valid) + body
		);
		expect(errors).toEqual([]);
		expect(post?.publishedOn).toBe("2026-09-09");
	});

	it("rejects a highlight that is not the end of the title", () => {
		const { errors } = checkPostSource(
			"review",
			"en",
			front({ ...valid, highlight: '"Reviewing"' }) + body
		);
		expect(errors.join()).toMatch(/highlight/);
	});

	it("rejects missing fields, raw HTML, http links and one-section bodies", () => {
		const withoutSummary = Object.fromEntries(
			Object.entries(valid).filter(([key]) => key !== "summary")
		);
		expect(
			checkPostSource("x", "en", front(withoutSummary) + body).errors.join()
		).toMatch(/summary/);
		expect(
			checkPostSource(
				"x",
				"en",
				`${front(valid)}${body}<div>x</div>\n`
			).errors.join()
		).toMatch(/HTML/);
		expect(
			checkPostSource(
				"x",
				"en",
				`${front(valid)}${body}[a](http://x.com)\n`
			).errors.join()
		).toMatch(/https/);
		expect(
			checkPostSource("x", "en", `${front(valid)}## Only one\n`).errors.join()
		).toMatch(/two ## sections/);
	});

	it("keeps the editions from mixing", () => {
		expect(
			checkPostSource("x", "en", `${front(valid)}${body}中文\n`).errors.join()
		).toMatch(/Chinese characters/);
		const english =
			"one two three four five six seven eight nine ten eleven twelve";
		const zhValid = {
			...valid,
			title: '"审查代码：我先看什么"',
			highlight: '"我先看什么"',
		};
		const zhBody = "引言。\n\n## 契约\n\n内容。\n\n## 失败场景\n\n更多内容。\n";
		expect(checkPostSource("x", "zh", front(zhValid) + zhBody).errors).toEqual(
			[]
		);
		expect(
			checkPostSource(
				"x",
				"zh",
				`${front(zhValid)}${zhBody}${english}\n`
			).errors.join()
		).toMatch(/English prose/);
	});

	it("checks that a pair agrees on topic and date", () => {
		const en = checkPostSource("x", "en", front(valid) + body).post;
		const zh = checkPostSource(
			"x",
			"en",
			front({ ...valid, publishedOn: "2026-09-10" }) + body
		).post;
		expect(en && zh && checkPair(en, zh).join()).toMatch(/publishedOn/);
	});

	it("finds ## headings outside code and estimates reading time", () => {
		expect(
			headingsOf("## One\n```\n## not a heading\n```\n## Two").map(
				(heading) => heading.text
			)
		).toEqual(["One", "Two"]);
		expect(readingMinutes("word ".repeat(440))).toBe(2);
		expect(readingMinutes("字".repeat(700))).toBe(2);
		expect(readingMinutes("short")).toBe(1);
	});
});

describe("search", () => {
	const post = (
		slug: string,
		title: string,
		body: string,
		publishedOn = "2026-01-01"
	): SearchablePost => ({
		slug,
		no: 1,
		title,
		summary: "A summary.",
		topic: "tech",
		topicName: "Tech",
		publishedOn,
		minutes: 1,
		body,
	});
	const posts = [
		post(
			"search",
			"Fuzzy search with OpenSearch",
			"Analyzers and edit distance.",
			"2026-02-01"
		),
		post(
			"banks",
			"Integrations in a regulated bank",
			"Contracts and access control."
		),
		post("zh", "在银行做集成", "受监管的银行环境。"),
	];

	it("tolerates typos in Latin words", () => {
		expect(
			search(posts, "opensearh", false).map((result) => result.post.slug)
		).toEqual(["search"]);
	});

	it("requires every token to match", () => {
		expect(search(posts, "contracts opensearch", false)).toEqual([]);
	});

	it("matches Chinese by substring", () => {
		expect(
			search(posts, "银行", true).map((result) => result.post.slug)
		).toEqual(["zh"]);
	});

	it("reports where it matched and highlights the hit", () => {
		const [result] = search(posts, "regulated", false);
		expect(result?.where).toEqual(["title"]);
		expect(
			result?.title.filter((part) => part.hit).map((part) => part.text)
		).toEqual(["regulated"]);
	});
});

describe("locale helpers", () => {
	it("formats dates per edition", () => {
		expect(formatDate("en", "2026-09-09")).toBe("9 Sep 2026");
		expect(formatDate("zh", "2026-11-12")).toBe("2026年11月12日");
	});

	it("builds edition paths and fills placeholders", () => {
		expect(localePath("en", "/writing")).toBe("/writing");
		expect(localePath("zh", "/")).toBe("/zh");
		expect(fill("{n} posts match “{q}”", { n: 2, q: "api" })).toBe(
			"2 posts match “api”"
		);
	});
});
