import { connection } from "next/server";
import { hasLocale, locales } from "@/lib/i18n/locales";
import { resumeFileName } from "@/lib/resume";
import { renderResumePdf } from "@/lib/resume-pdf/render";

export function generateStaticParams(): Array<{ lang: string }> {
	return locales.map((lang) => ({ lang }));
}

/** The resume PDF, generated on request from resume.json (fonts are cached). */
export async function GET(
	_request: Request,
	{ params }: RouteContext<"/[lang]/resume.pdf">
): Promise<Response> {
	// Rendered on request (fonts cached), never prerendered at build time.
	await connection();
	const { lang } = await params;
	if (!hasLocale(lang)) return new Response(null, { status: 404 });
	const pdf = await renderResumePdf(lang);
	return new Response(pdf, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(resumeFileName(lang))}`,
		},
	});
}
