import type { Locale } from "@/lib/i18n/locales";

type Bilingual = { readonly en: string; readonly zh: string };

/** A diagram box: its label plus how it is drawn. */
export type DiagramBox = {
	readonly label: string;
	readonly emphasis?: "marker" | "night";
};

/** The type of a bilingual JSON value once one language is picked. */
export type Localized<T> = T extends Bilingual & { readonly emphasis: string }
	? DiagramBox
	: T extends Bilingual
		? T extends { readonly emphasis?: string }
			? string | DiagramBox
			: string
		: T extends ReadonlyArray<infer U>
			? Array<Localized<U>>
			: T extends object
				? { [K in keyof T]: Localized<T[K]> }
				: T;

function isBilingual(value: object): value is Bilingual {
	return (
		typeof (value as Partial<Bilingual>).en === "string" &&
		typeof (value as Partial<Bilingual>).zh === "string" &&
		Object.keys(value).every(
			(key) => key === "en" || key === "zh" || key === "emphasis"
		)
	);
}

/**
 * Picks one language from copy stored as `{ en, zh }` pairs (the copywriting
 * JSON files), keeping every other value as it is. A pair with `emphasis`
 * (a diagram box) becomes `{ label, emphasis }`.
 */
export function localize<T>(value: T, locale: Locale): Localized<T> {
	if (Array.isArray(value)) {
		return value.map((item: unknown) => localize(item, locale)) as Localized<T>;
	}
	if (value !== null && typeof value === "object") {
		if (isBilingual(value)) {
			const emphasis = (value as { emphasis?: unknown }).emphasis;
			return (
				typeof emphasis === "string"
					? { label: value[locale], emphasis }
					: value[locale]
			) as Localized<T>;
		}
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [key, localize(item, locale)])
		) as Localized<T>;
	}
	return value as Localized<T>;
}
