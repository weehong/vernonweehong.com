import { parse as parseYaml } from "yaml";

/**
 * Parses and checks one post file (docs/design/pages.md, Posts). Pure, so the
 * build and the unit tests share it.
 */

export type Topic = "tech" | "reflections";

export type PostSource = {
	readonly slug: string;
	readonly title: string;
	/** Closing words of the title, drawn with the highlighter. */
	readonly highlight: string;
	readonly summary: string;
	readonly standfirst: string;
	readonly topic: Topic;
	/** ISO date, e.g. 2026-09-09. */
	readonly publishedOn: string;
	readonly updatedOn?: string;
	readonly status: "draft" | "published";
	/** Markdown body, without frontmatter. */
	readonly body: string;
};

export type Heading = { readonly id: string; readonly text: string };

const REQUIRED = [
	"title",
	"highlight",
	"summary",
	"standfirst",
	"topic",
	"publishedOn",
	"status",
] as const;
const ALLOWED = new Set<string>([...REQUIRED, "updatedOn"]);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CJK = /[㐀-鿿豈-﫿]/;

/** Anchor id for a `##` heading; PostBody uses the same function. */
export function headingId(text: string): string {
	const id = text
		.trim()
		.toLowerCase()
		.replaceAll(/[^\p{L}\p{N}]+/gu, "-")
		.replaceAll(/^-+|-+$/g, "");
	return id || "section";
}

/** The body without fenced code blocks (code is exempt from the language checks). */
function withoutCode(body: string): string {
	return body.replaceAll(/^```[\s\S]*?^```/gm, "").replaceAll(/`[^`\n]*`/g, "");
}

/** `##` headings, in order, outside code blocks. */
export function headingsOf(body: string): Array<Heading> {
	return withoutCode(body)
		.split("\n")
		.filter((line) => line.startsWith("## "))
		.map((line) => {
			const text = line.slice(3).trim();
			return { id: headingId(text), text };
		});
}

/** Plain text for search: Markdown stripped, code blocks removed. */
export function plainText(body: string): string {
	return body
		.replaceAll(/^```[\s\S]*?^```/gm, " ")
		.replaceAll(/\[!(note|tip|important|warning|caution)\]/gi, " ")
		.replaceAll(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replaceAll(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replaceAll(/[`*_>#~|]/g, " ")
		.replaceAll(/^\s*[-+]\s+|^\s*\d+\.\s+/gm, " ")
		.replaceAll(/\s+/g, " ")
		.trim();
}

/** English words ÷ 220, Chinese characters ÷ 350; rounded, at least 1. */
export function readingMinutes(body: string): number {
	const text = plainText(body);
	const chinese = [...text].filter((char) => CJK.test(char)).length;
	const words = text
		.replaceAll(new RegExp(CJK.source, "gu"), " ")
		.split(/\s+/)
		.filter((word) => /[A-Za-z0-9]/.test(word)).length;
	return Math.max(1, Math.round(words / 220 + chinese / 350));
}

function splitFrontmatter(
	source: string
): { yaml: string; body: string } | undefined {
	const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(
		source.replaceAll("\r\n", "\n")
	);
	return match ? { yaml: match[1] ?? "", body: match[2] ?? "" } : undefined;
}

function asDate(value: unknown): string | undefined {
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	return typeof value === "string" && DATE.test(value) ? value : undefined;
}

/** Checks one file. `locale` is the folder it came from. */
export function checkPostSource(
	slug: string,
	locale: "en" | "zh",
	source: string
): { post?: PostSource; errors: Array<string> } {
	const errors: Array<string> = [];
	const parts = splitFrontmatter(source);
	if (!parts) return { errors: ["must start with a --- frontmatter block"] };

	let data: Record<string, unknown>;
	try {
		data = (parseYaml(parts.yaml) ?? {}) as Record<string, unknown>;
	} catch (error) {
		return {
			errors: [`frontmatter is not valid YAML (${(error as Error).message})`],
		};
	}

	for (const key of Object.keys(data)) {
		if (!ALLOWED.has(key)) errors.push(`unknown frontmatter field "${key}"`);
	}
	for (const key of REQUIRED) {
		if (data[key] === undefined || data[key] === "")
			errors.push(`"${key}" is required`);
	}
	const text = (key: string): string =>
		typeof data[key] === "string" ? data[key] : "";
	const topic = text("topic");
	const status = text("status");
	const publishedOn = asDate(data["publishedOn"]);
	const updatedOn =
		data["updatedOn"] === undefined ? undefined : asDate(data["updatedOn"]);

	if (topic && topic !== "tech" && topic !== "reflections")
		errors.push(`"topic" must be tech or reflections`);
	if (status && status !== "draft" && status !== "published")
		errors.push(`"status" must be draft or published`);
	if (data["publishedOn"] !== undefined && !publishedOn)
		errors.push(`"publishedOn" must be a date like 2026-09-09`);
	if (data["updatedOn"] !== undefined && !updatedOn)
		errors.push(`"updatedOn" must be a date like 2026-09-20`);
	if (text("highlight") && !text("title").endsWith(text("highlight"))) {
		errors.push(`"highlight" must be the closing words of "title"`);
	}

	const body = parts.body;
	const prose = withoutCode(body);
	if (headingsOf(body).length < 2)
		errors.push("the body needs at least two ## sections");
	for (const match of prose.matchAll(/\]\(([^)\s]+)/g)) {
		const href = match[1] ?? "";
		if (
			!href.startsWith("https://") &&
			!href.startsWith("/") &&
			!href.startsWith("#")
		) {
			errors.push(`link "${href}" must use https`);
		}
	}
	if (/<\/?[A-Za-z][^>]*>/.test(prose)) errors.push("raw HTML is not allowed");
	if (/^(import|export)\s/m.test(prose))
		errors.push("import and export lines are not allowed");
	if (locale === "en" && CJK.test(prose))
		errors.push("the English file contains Chinese characters");
	if (
		locale === "zh" &&
		/(?:[A-Za-z][A-Za-z'’-]*[\s,]+){10,}[A-Za-z]/.test(prose)
	) {
		errors.push(
			"the Chinese file contains a run of English prose longer than ten words"
		);
	}

	if (errors.length > 0 || !publishedOn) return { errors };
	return {
		errors,
		post: {
			slug,
			title: text("title"),
			highlight: text("highlight"),
			summary: text("summary"),
			standfirst: text("standfirst"),
			topic: topic as Topic,
			publishedOn,
			...(updatedOn ? { updatedOn } : {}),
			status: status as "draft" | "published",
			body,
		},
	};
}

/** Checks that a post's two languages agree on topic and date. */
export function checkPair(en: PostSource, zh: PostSource): Array<string> {
	const errors: Array<string> = [];
	if (en.topic !== zh.topic)
		errors.push(`${en.slug}: topic differs between languages`);
	if (en.publishedOn !== zh.publishedOn)
		errors.push(`${en.slug}: publishedOn differs between languages`);
	return errors;
}
