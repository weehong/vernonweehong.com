import { hasLocale } from "@/lib/i18n/locales";
import { getResume } from "@/lib/resume";
import { renderShareImage, shareSize } from "@/lib/share/image";

export const size = shareSize;
export const contentType = "image/png";
export const alt = "Vernon Wee Hong KOH · Resume";

/** Resume share image: the full name and the title. */
export default async function Image({
	params,
}: {
	readonly params: Promise<{ lang: string }>;
}): Promise<Response> {
	const { lang } = await params;
	const locale = hasLocale(lang) ? lang : "en";
	return renderShareImage({
		lead: "Vernon Wee Hong ",
		highlight: "KOH",
		label: getResume(locale).header.title,
		chinese: locale === "zh",
	});
}
