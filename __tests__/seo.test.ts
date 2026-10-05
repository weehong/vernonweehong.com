import { afterEach, expect, test, vi } from "vitest";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { pageMetadata } from "../lib/metadata";
import { skills } from "../lib/profile";
import { siteConfig } from "../lib/site-config";
import {
	buildGraph,
	getPersonNode,
	getProfilePageNode,
	getResumeNodes,
	personId,
	websiteId,
} from "../lib/structured-data";

type JsonLdNode = Record<string, unknown>;

function graphNodes(graph: ReturnType<typeof buildGraph>): Array<JsonLdNode> {
	return graph["@graph"] as unknown as Array<JsonLdNode>;
}

function nodeOfType(
	nodes: Array<JsonLdNode>,
	type: string
): JsonLdNode | undefined {
	return nodes.find((node) => node["@type"] === type);
}

afterEach(() => {
	vi.unstubAllEnvs();
	vi.resetModules();
});

test("homepage graph links WebSite, Person and ProfilePage by @id", () => {
	const nodes = graphNodes(buildGraph(getProfilePageNode()));

	expect(nodes.map((node) => node["@type"])).toEqual([
		"WebSite",
		"Person",
		"ProfilePage",
	]);
	expect(nodeOfType(nodes, "WebSite")).toMatchObject({
		"@id": websiteId,
		name: siteConfig.siteName,
		publisher: { "@id": personId },
	});
	expect(nodeOfType(nodes, "Person")).toMatchObject({ "@id": personId });
	expect(nodeOfType(nodes, "ProfilePage")).toMatchObject({
		isPartOf: { "@id": websiteId },
		mainEntity: { "@id": personId },
		dateModified: siteConfig.lastModified,
	});
});

test("person lists every name variant, skills, employer and schools", () => {
	const person = getPersonNode() as unknown as JsonLdNode;

	expect(person["alternateName"]).toEqual([
		"Vernon Koh",
		"Vernon Wee Hong Koh",
		"Wee Hong Koh",
		"Koh Wee Hong",
	]);
	expect(person["knowsAbout"]).toEqual(skills.flatMap((group) => group.items));
	expect(person["worksFor"]).toMatchObject({
		"@type": "Organization",
		name: "DBS Bank",
	});
	expect(person["alumniOf"]).toHaveLength(2);
	expect(person).not.toHaveProperty("image");
});

test("resume graph adds a WebPage and a Home → Resume breadcrumb", () => {
	const nodes = graphNodes(buildGraph(...getResumeNodes("Resume summary")));

	expect(nodeOfType(nodes, "WebPage")).toMatchObject({
		url: `${siteConfig.url}/resume`,
		description: "Resume summary",
		about: { "@id": personId },
	});
	expect(nodeOfType(nodes, "BreadcrumbList")).toMatchObject({
		itemListElement: [
			{ position: 1, name: "Home", item: siteConfig.url },
			{ position: 2, name: "Resume", item: `${siteConfig.url}/resume` },
		],
	});
});

test("pageMetadata keeps shared Open Graph fields on page overrides", () => {
	const metadata = pageMetadata({ title: "Resume", path: "/resume" });

	expect(metadata.alternates?.canonical).toBe("/resume");
	expect(metadata.openGraph).toMatchObject({
		type: "website",
		url: "/resume",
		siteName: siteConfig.siteName,
		locale: siteConfig.locale,
		title: `Resume | ${siteConfig.siteName}`,
	});
	expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
});

test("pageMetadata emits Open Graph profile fields for the homepage", () => {
	const metadata = pageMetadata({
		title: { absolute: siteConfig.title },
		path: "/",
		ogType: "profile",
	});

	expect(metadata.openGraph).toMatchObject({
		type: "profile",
		title: siteConfig.title,
		firstName: "Vernon",
		lastName: "Koh",
	});
});

test("sitemap lists both pages with the fixed content date", () => {
	expect(sitemap().map((entry) => [entry.url, entry.lastModified])).toEqual([
		[siteConfig.url, siteConfig.lastModified],
		[`${siteConfig.url}/resume`, siteConfig.lastModified],
	]);
});

test("robots blocks all crawlers outside production", () => {
	expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
});

test("robots allows crawling and lists the sitemap in production", async () => {
	vi.stubEnv("NEXT_PUBLIC_APP_ENVIRONMENT", "production");
	vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://vernonweehong.com/");
	vi.resetModules();

	const { default: productionRobots } = await import("../app/robots");

	expect(productionRobots()).toEqual({
		rules: { userAgent: "*", allow: "/" },
		sitemap: "https://vernonweehong.com/sitemap.xml",
	});
});

test("site config fails fast in production without a site URL", async () => {
	vi.stubEnv("NEXT_PUBLIC_APP_ENVIRONMENT", "production");
	vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
	vi.resetModules();

	await expect(import("../lib/site-config")).rejects.toThrow(
		"NEXT_PUBLIC_SITE_URL"
	);
});

test("site config falls back to localhost when the URL is empty", async () => {
	vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
	vi.resetModules();

	const { siteConfig: config } = await import("../lib/site-config");

	expect(config.url).toBe("http://localhost:3000");
});
