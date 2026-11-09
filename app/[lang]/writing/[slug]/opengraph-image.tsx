import { getDictionary } from "@/lib/i18n/dictionaries";
import { hasLocale } from "@/lib/i18n/locales";
import { renderShareImage, shareSize } from "@/lib/share/image";
import { getPost } from "@/lib/writing/posts";

export const size = shareSize;
export const contentType = "image/png";
export const alt = "Vernon KOH";

/** Post share image: the title with its highlight, topic as the label. */
export default async function Image({
	params,
}: {
	readonly params: Promise<{ lang: string; slug: string }>;
}): Promise<Response> {
	const { lang, slug } = await params;
	const locale = hasLocale(lang) ? lang : "en";
	const post = getPost(locale, slug);
	if (!post) return new Response(null, { status: 404 });
	return renderShareImage({
		lead: post.title.slice(0, post.title.length - post.highlight.length),
		highlight: post.highlight,
		label: getDictionary(locale).topics[post.topic],
		chinese: locale === "zh",
	});
}
