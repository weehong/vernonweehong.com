import { getDictionary } from "@/lib/i18n/dictionaries";
import { hasLocale } from "@/lib/i18n/locales";
import { renderShareImage, shareSize } from "@/lib/share/image";

export const size = shareSize;
export const contentType = "image/png";
export const alt = "Writing · Vernon KOH";

/** Writing index share image: the index heading. */
export default async function Image({
	params,
}: {
	readonly params: Promise<{ lang: string }>;
}): Promise<Response> {
	const { lang } = await params;
	const locale = hasLocale(lang) ? lang : "en";
	const dict = getDictionary(locale);
	return renderShareImage({
		lead: dict.writingTitle.lead,
		highlight: dict.writingTitle.mark,
		tail: dict.writingTitle.tail,
		label: dict.writing,
		chinese: locale === "zh",
	});
}
