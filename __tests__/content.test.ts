import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import en from "@/app/[lang]/dictionaries/en.json";
import zh from "@/app/[lang]/dictionaries/zh.json";
import home from "@/docs/design/copywriting/home.json";
import resume from "@/docs/design/copywriting/resume.json";
import { darkTokens, lightTokens } from "@/lib/design-tokens";
import { localize } from "@/lib/content/localize";

function keyPaths(value: unknown, prefix = ""): Array<string> {
	if (value === null || typeof value !== "object") return [prefix];
	return Object.entries(value).flatMap(([key, item]) =>
		keyPaths(item, prefix ? `${prefix}.${key}` : key)
	);
}

/** Every `{ en, zh }` pair in a copywriting file. */
function pairs(
	value: unknown,
	path = ""
): Array<{ path: string; en: string; zh: string }> {
	if (Array.isArray(value))
		return value.flatMap((item, index) => pairs(item, `${path}[${index}]`));
	if (value === null || typeof value !== "object") return [];
	const record = value as Record<string, unknown>;
	if (typeof record["en"] === "string" && typeof record["zh"] === "string") {
		return [{ path, en: record["en"], zh: record["zh"] }];
	}
	return Object.entries(record).flatMap(([key, item]) =>
		pairs(item, path ? `${path}.${key}` : key)
	);
}

const numbers = (text: string): string =>
	(text.replaceAll(/,(?=\d{3})/g, "").match(/\d+(\.\d+)?/g) ?? [])
		.toSorted()
		.join(",");
const bold = (text: string): number => text.split("**").length - 1;

describe("dictionaries", () => {
	it("have identical keys in both languages", () => {
		expect(keyPaths(zh).toSorted()).toEqual(keyPaths(en).toSorted());
	});

	it("never write the surname in lower case", () => {
		expect(JSON.stringify([en, zh])).not.toMatch(/\bKoh\b/);
	});
});

describe.each([
	["home.json", home],
	["resume.json", resume],
])("copywriting %s", (_name, copy) => {
	it("has the same numbers and bold marks in both languages", () => {
		for (const pair of pairs(copy)) {
			expect(numbers(pair.zh), pair.path).toBe(numbers(pair.en));
			expect(bold(pair.zh), pair.path).toBe(bold(pair.en));
		}
	});

	it("localizes to the same shape in both languages", () => {
		expect(keyPaths(localize(copy, "zh")).toSorted()).toEqual(
			keyPaths(localize(copy, "en")).toSorted()
		);
	});
});

describe("homepage and resume agree on career facts", () => {
	const short = (name: string): string => name.replace(/ Pte\. Ltd\.$/, "");

	/** On the homepage only; the resume lists employers (docs/design/pages.md). */
	const HOMEPAGE_ONLY = new Set(["Resetrix"]);

	it("lists the same jobs, roles and years", () => {
		const entries = localize(home, "en").experience.entries.filter(
			(entry) => !HOMEPAGE_ONLY.has(entry.company)
		);
		const jobs = localize(resume, "en").experience;
		expect(entries.map((entry) => entry.company)).toEqual(
			jobs.map((job) => short(job.company))
		);
		entries.forEach((entry, index) => {
			const job = jobs[index];
			expect(job).toBeDefined();
			if (!job) return;
			const [start, end] = entry.period.split(" — ");
			expect(entry.role).toBe(job.role);
			expect(start).toBe(job.start.slice(0, 4));
			expect(end).toBe(job.end === null ? "now" : job.end.slice(0, 4));
		});
	});

	it("uses only numbers the resume states", () => {
		const resumeText = JSON.stringify(resume).replaceAll(/,(?=\d{3})/g, "");
		for (const entry of localize(home, "en").experience.entries) {
			for (const outcome of entry.outcomes) {
				for (const match of outcome.matchAll(/\*\*(.+?)\*\*/g)) {
					for (const number of match[1]?.match(/\d+(\.\d+)?/g) ?? []) {
						expect(resumeText, outcome).toContain(number);
					}
				}
			}
		}
	});
});

describe("design tokens", () => {
	const theme = readFileSync(
		join(process.cwd(), "docs/design/theme.css"),
		"utf8"
	);
	const [light = "", dark = ""] = theme.split(/^\.dark \{/m);
	const kebab = (name: string): string =>
		name.replaceAll(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

	it("match the light theme in theme.css", () => {
		for (const [name, value] of Object.entries(lightTokens)) {
			expect(light, name).toContain(`--${kebab(name)}: ${value};`);
		}
	});

	it("match the dark theme in theme.css", () => {
		for (const [name, value] of Object.entries(darkTokens)) {
			expect(dark, name).toContain(`--${kebab(name)}: ${value};`);
		}
	});
});
