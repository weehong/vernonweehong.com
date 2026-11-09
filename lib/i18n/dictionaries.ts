import en from "@/app/[lang]/dictionaries/en.json";
import zh from "@/app/[lang]/dictionaries/zh.json";
import type { Locale } from "@/lib/i18n/locales";

/** Interface text for one edition (docs/design/pages.md, Interface text). */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, zh };

export function getDictionary(locale: Locale): Dictionary {
	return dictionaries[locale];
}
