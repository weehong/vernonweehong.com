import { getDictionary } from "@/lib/i18n/dictionaries";
import { hasLocale, locales } from "@/lib/i18n/locales";
import { searchIndex } from "@/lib/writing/posts";

export function generateStaticParams(): Array<{ lang: string }> {
	return locales.map((lang) => ({ lang }));
}

/** The edition's search index, built at build time (docs/design/pages.md, Search). */
export async function GET(
	_request: Request,
	{ params }: RouteContext<"/[lang]/writing/search-index.json">
): Promise<Response> {
	const { lang } = await params;
	if (!hasLocale(lang)) return new Response(null, { status: 404 });
	return Response.json(searchIndex(lang, getDictionary(lang).topics), {
		// Data for the search box, not a page: keep it out of search results.
		headers: { "X-Robots-Tag": "noindex" },
	});
}
