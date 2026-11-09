import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { hasLocale, localePath, locales } from "@/lib/i18n/locales";
import { siteConfig } from "@/lib/site-config";
import { getPosts } from "@/lib/writing/posts";

export function generateStaticParams(): Array<{ lang: string }> {
	return locales.map((lang) => ({ lang }));
}

const markdown = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkRehype)
	.use(rehypeStringify);

function escapeXml(text: string): string {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

/** RSS per edition: full text, newest 20, this edition's posts only. */
export async function GET(
	_request: Request,
	{ params }: RouteContext<"/[lang]/feed.xml">
): Promise<Response> {
	const { lang } = await params;
	if (!hasLocale(lang)) return new Response(null, { status: 404 });
	const dict = getDictionary(lang);
	const home = `${siteConfig.url}${localePath(lang, "/writing")}`;
	const posts = getPosts(lang).slice(0, 20);

	const items = await Promise.all(
		posts.map(async (post) => {
			const url = `${siteConfig.url}${localePath(lang, `/writing/${post.slug}`)}`;
			const html = String(await markdown.process(post.body)).replaceAll(
				"]]>",
				"]]]]><![CDATA[>"
			);
			return [
				"<item>",
				`<title>${escapeXml(post.title)}</title>`,
				`<link>${url}</link>`,
				`<guid isPermaLink="true">${url}</guid>`,
				`<pubDate>${new Date(`${post.publishedOn}T00:00:00Z`).toUTCString()}</pubDate>`,
				`<category>${escapeXml(dict.topics[post.topic])}</category>`,
				`<description>${escapeXml(post.summary)}</description>`,
				`<content:encoded><![CDATA[${html}]]></content:encoded>`,
				"</item>",
			].join("");
		})
	);

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
		"<channel>",
		`<title>${escapeXml(`${dict.writing} · ${siteConfig.shortName}`)}</title>`,
		`<link>${home}</link>`,
		`<atom:link href="${siteConfig.url}${localePath(lang, "/feed.xml")}" rel="self" type="application/rss+xml"/>`,
		`<description>${escapeXml(dict.meta.writingDescription)}</description>`,
		`<language>${lang === "zh" ? "zh-Hans" : "en"}</language>`,
		...items,
		"</channel>",
		"</rss>",
	].join("\n");

	return new Response(xml, {
		headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
	});
}
