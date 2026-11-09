/**
 * The two language editions (docs/design/pages.md, Routing). English is the
 * default and has no URL prefix; Chinese lives under /zh.
 */

export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function hasLocale(value: string): value is Locale {
	return (locales as ReadonlyArray<string>).includes(value);
}

/** Value for `<html lang>`. */
export function htmlLang(locale: Locale): "en" | "zh-Hans" {
	return locale === "zh" ? "zh-Hans" : "en";
}

/** Open Graph locale. */
export function ogLocale(locale: Locale): "en_SG" | "zh_CN" {
	return locale === "zh" ? "zh_CN" : "en_SG";
}

/**
 * The public URL of a page in an edition. `path` is the unprefixed English
 * path ("/", "/writing", "/writing/slug").
 */
export function localePath(locale: Locale, path: string): string {
	if (locale === "en") return path;
	return path === "/" ? "/zh" : `/zh${path}`;
}

export type Alternates = {
	readonly en: string;
	readonly "zh-Hans": string;
	readonly "x-default": string;
};

/** Links to the same page in both editions (LanguageSwitch and metadata). */
export function alternatesFor(path: string): Alternates {
	return {
		en: localePath("en", path),
		"zh-Hans": localePath("zh", path),
		"x-default": localePath("en", path),
	};
}

const chineseDate = new Intl.DateTimeFormat("zh-CN", {
	dateStyle: "long",
	timeZone: "UTC",
});

// Fixed English month names: Intl's short months vary by ICU version ("Sep" / "Sept").
const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
] as const;

/** "12 Nov 2026" / "2026年11月12日" from an ISO date ("2026-11-12"). */
export function formatDate(locale: Locale, isoDate: string): string {
	if (locale === "en") {
		const [year = "", month = "1", day = "1"] = isoDate.split("-");
		return `${Number(day)} ${MONTHS[Number(month) - 1] ?? ""} ${year}`;
	}
	return chineseDate.format(new Date(`${isoDate}T00:00:00Z`));
}

/** Replaces `{name}` placeholders in a dictionary string. */
export function fill(
	template: string,
	values: Readonly<Record<string, string | number>>
): string {
	return template.replaceAll(/\{(\w+)\}/g, (match, key: string) =>
		key in values ? String(values[key]) : match
	);
}

/** "Apr 2020" / "2020 年 4 月" from "2020-04", using the dictionary template. */
export function formatMonth(
	locale: Locale,
	yearMonth: string,
	template: string
): string {
	const [year = "", month = "1"] = yearMonth.split("-");
	const name =
		locale === "en" ? (MONTHS[Number(month) - 1] ?? "") : String(Number(month));
	return fill(template, { month: name, year });
}
