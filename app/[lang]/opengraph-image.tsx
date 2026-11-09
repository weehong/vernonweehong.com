import { hasLocale } from "@/lib/i18n/locales";
import { getProfile } from "@/lib/profile";
import { renderShareImage, shareSize } from "@/lib/share/image";

export const size = shareSize;
export const contentType = "image/png";
export const alt = "Vernon KOH";

/** Homepage share image: the hero statement. */
export default async function Image({
	params,
}: {
	readonly params: Promise<{ lang: string }>;
}): Promise<Response> {
	const { lang } = await params;
	const locale = hasLocale(lang) ? lang : "en";
	const { statement } = getProfile(locale).hero;
	return renderShareImage({
		lead: statement.lead,
		highlight: statement.mark,
		tail: statement.tail,
		chinese: locale === "zh",
	});
}
