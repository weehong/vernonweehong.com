import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { WritingLayout } from "@/components/layout/writing-layout";
import { SubscribePanel } from "@/components/writing/subscribe-panel";
import { WritingHeader } from "@/components/writing/writing-header";
import { WritingIndex } from "@/components/writing/writing-index";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { alternatesFor, hasLocale, localePath } from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/metadata";
import { writingLinks } from "@/lib/page-links";
import { archiveEntry } from "@/lib/writing/entries";
import { writingGraph } from "@/lib/structured-data";
import { getPosts } from "@/lib/writing/posts";

export async function generateMetadata({
	params,
}: PageProps<"/[lang]/writing">): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};
	const dict = getDictionary(lang);
	return pageMetadata({
		locale: lang,
		title: dict.writing,
		description: dict.meta.writingDescription,
		path: "/writing",
	});
}

export default async function WritingPage({
	params,
}: PageProps<"/[lang]/writing">): Promise<React.ReactElement> {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = getDictionary(lang);
	const editionPosts = getPosts(lang);
	const posts = editionPosts.map((post) => archiveEntry(post, dict));

	return (
		<WritingLayout
			locale={lang}
			dictionary={dict}
			alternates={alternatesFor("/writing")}
			linkColumn={writingLinks(lang, dict)}
		>
			<JsonLd data={writingGraph(lang, editionPosts)} />
			<WritingHeader locale={lang} dictionary={dict} />
			<WritingIndex
				posts={posts}
				indexUrl={localePath(lang, "/writing/search-index.json")}
				chinese={lang === "zh"}
				dictionary={dict}
			/>
			<SubscribePanel locale={lang} dictionary={dict} />
		</WritingLayout>
	);
}
