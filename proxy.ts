import { NextResponse, type NextRequest } from "next/server";

/**
 * Language editions (docs/design/pages.md, Routing):
 * - /zh and /zh/… are served as they are.
 * - /en and /en/… redirect (308) to the unprefixed URL: one URL per page.
 * - Everything else is rewritten (not redirected) to /en/…, so English URLs
 *   stay unprefixed.
 * - The one automatic language step: a `locale=zh` cookie (set by the
 *   LanguageSwitch) sends exactly `/` to `/zh`. No Accept-Language redirects.
 */
export function proxy(request: NextRequest): NextResponse {
	const { pathname } = request.nextUrl;

	if (pathname === "/zh" || pathname.startsWith("/zh/")) {
		return NextResponse.next();
	}

	// Share images are linked from metadata with their real /en/… path; serve
	// them as they are instead of redirecting crawlers.
	if (/^\/en\/(?:.*\/)?(?:opengraph|twitter)-image/.test(pathname)) {
		return NextResponse.next();
	}

	if (pathname === "/en" || pathname.startsWith("/en/")) {
		const url = request.nextUrl.clone();
		url.pathname = pathname.slice(3) || "/";
		return NextResponse.redirect(url, 308);
	}

	if (pathname === "/" && request.cookies.get("locale")?.value === "zh") {
		const url = request.nextUrl.clone();
		url.pathname = "/zh";
		return NextResponse.redirect(url, 307);
	}

	const url = request.nextUrl.clone();
	url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
	return NextResponse.rewrite(url);
}

export const config = {
	matcher: [
		// Skip Next internals, API routes, root metadata files (icon, robots,
		// sitemap) and files with an extension. Share images live under [lang],
		// so they are rewritten like pages; feed.xml and the search index are
		// listed below.
		"/((?!_next/|api/|favicon\\.ico|icon|apple-icon|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|.*\\.[a-z0-9]+$).*)",
		"/feed.xml",
		"/resume.pdf",
		"/writing/search-index.json",
		"/zh/feed.xml",
	],
};
