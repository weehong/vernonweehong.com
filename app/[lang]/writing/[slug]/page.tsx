import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { PostLayout } from "@/components/layout/post-layout";
import { HowWritten } from "@/components/post/how-written";
import { PostActions } from "@/components/post/post-actions";
import { PostBody } from "@/components/post/post-body";
import { PostHeader } from "@/components/post/post-header";
import { RelatedPosts } from "@/components/post/related-posts";
import { SubscribePanel } from "@/components/writing/subscribe-panel";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
	alternatesFor,
	fill,
	formatDate,
	hasLocale,
	localePath,
	locales,
} from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/metadata";
import { postLinks } from "@/lib/page-links";
import { postGraph } from "@/lib/structured-data";
import { relatedEntry } from "@/lib/writing/entries";
import { getPost, getPosts, relatedPosts } from "@/lib/writing/posts";

export function generateStaticParams(): Array<{ lang: string; slug: string }> {
	const params = locales.flatMap((lang) =>
		getPosts(lang).map((post) => ({ lang, slug: post.slug }))
	);
	// Cache Components needs at least one value; an unknown slug renders not-found.
	return params.length > 0 ? params : [{ lang: "en", slug: "none" }];
}

export async function generateMetadata({
	params,
}: PageProps<"/[lang]/writing/[slug]">): Promise<Metadata> {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) return {};
	const post = getPost(lang, slug);
	if (!post) return {};
	return pageMetadata({
		locale: lang,
		title: post.title,
		description: post.summary,
		path: `/writing/${slug}`,
		type: "article",
		publishedTime: post.publishedOn,
		modifiedTime: post.updatedOn ?? post.publishedOn,
		section: getDictionary(lang).topics[post.topic],
	});
}

export default async function PostPage({
	params,
}: PageProps<"/[lang]/writing/[slug]">): Promise<React.ReactElement> {
	const { lang, slug } = await params;
	if (!hasLocale(lang)) notFound();
	const post = getPost(lang, slug);
	if (!post) notFound();
	const dict = getDictionary(lang);

	return (
		<PostLayout
			locale={lang}
			dictionary={dict}
			alternates={alternatesFor(`/writing/${slug}`)}
			linkColumn={postLinks(lang, dict, post.headings)}
		>
			<JsonLd data={postGraph(lang, post)} />
			<PostHeader
				indexHref={localePath(lang, "/writing")}
				allWriting={dict.allWriting}
				topic={post.topic}
				topicName={dict.topics[post.topic]}
				date={formatDate(lang, post.publishedOn)}
				dateTime={post.publishedOn}
				minutesLabel={fill(dict.minutes, { n: post.minutes })}
				aiTag={dict.post.aiTag}
				title={post.title}
				highlight={post.highlight}
				standfirst={post.standfirst}
			/>
			<PostBody source={post.body} />
			<HowWritten title={dict.post.howTitle} body={dict.post.howBody} />
			<SubscribePanel locale={lang} dictionary={dict} />
			<PostActions
				thoughts={dict.post.thoughts}
				contactMe={dict.contactMe}
				contactHref={`${localePath(lang, "/")}#contact`}
			/>
			<RelatedPosts
				title={dict.post.related}
				posts={relatedPosts(post).map((other) => relatedEntry(other, dict))}
			/>
		</PostLayout>
	);
}
