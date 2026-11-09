import { describe, expect, it } from "vitest";
import { alternatesFor } from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/metadata";
import { homeGraph, postGraph, resumeGraph } from "@/lib/structured-data";
import type { Post } from "@/lib/writing/posts";

const nodes = (graph: {
	"@graph": ReadonlyArray<unknown>;
}): Array<Record<string, unknown>> =>
	graph["@graph"] as Array<Record<string, unknown>>;

describe("metadata", () => {
	it("gives every page a canonical URL and both language alternates", () => {
		const metadata = pageMetadata({
			locale: "zh",
			title: "写作",
			description: "d",
			path: "/writing",
		});
		expect(metadata.alternates?.canonical).toBe("/zh/writing");
		expect(metadata.alternates?.languages).toEqual(alternatesFor("/writing"));
		expect(metadata.openGraph).toMatchObject({
			locale: "zh_CN",
			url: "/zh/writing",
		});
	});
});

describe("structured data", () => {
	it("describes the owner on the homepage in each language", () => {
		for (const locale of ["en", "zh"] as const) {
			const graph = nodes(homeGraph(locale));
			const page = graph.find((node) => node["@type"] === "ProfilePage");
			const person = graph.find((node) => node["@type"] === "Person");
			expect(page?.["inLanguage"]).toBe(locale === "zh" ? "zh-Hans" : "en");
			expect(person?.["name"]).toBe("Vernon Wee Hong KOH");
			expect(person?.["sameAs"]).toContain("https://github.com/weehong");
		}
	});

	it("marks a post as a BlogPosting with dates and a breadcrumb", () => {
		const post = {
			slug: "review",
			locale: "en",
			title: "Reviewing code",
			highlight: "code",
			summary: "Summary.",
			standfirst: "Standfirst.",
			topic: "tech",
			publishedOn: "2026-09-09",
			status: "published",
			body: "",
			no: 1,
			minutes: 4,
			headings: [],
			text: "",
		} satisfies Post;
		const graph = nodes(postGraph("en", post));
		expect(graph.find((node) => node["@type"] === "BlogPosting")).toMatchObject(
			{
				headline: "Reviewing code",
				datePublished: "2026-09-09",
				dateModified: "2026-09-09",
				inLanguage: "en",
			}
		);
		expect(graph.some((node) => node["@type"] === "BreadcrumbList")).toBe(true);
	});

	it("dates each profile page with a full date-time and timezone", () => {
		for (const locale of ["en", "zh"] as const) {
			for (const graph of [homeGraph(locale), resumeGraph(locale)]) {
				const page = nodes(graph).find(
					(node) => node["@type"] === "ProfilePage"
				);
				expect(page?.["dateModified"]).toMatch(
					/^\d{4}-\d{2}-\d{2}T00:00:00\+08:00$/
				);
			}
		}
	});

	it("gives the resume a breadcrumb", () => {
		expect(
			nodes(resumeGraph("zh")).some(
				(node) => node["@type"] === "BreadcrumbList"
			)
		).toBe(true);
	});
});
