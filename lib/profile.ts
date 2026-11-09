import home from "@/docs/design/copywriting/home.json";
import {
	localize,
	type DiagramBox,
	type Localized,
} from "@/lib/content/localize";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Homepage copy for one edition, read straight from the approved
 * docs/design/copywriting/home.json (docs/design/pages.md, Profile).
 */
export type Profile = Localized<typeof home>;

export function getProfile(locale: Locale): Profile {
	return localize(home, locale);
}

/** Diagram rows in a project card: every box as `{ label, emphasis? }`. */
export function diagramBoxes(
	row: ReadonlyArray<string | DiagramBox>
): Array<DiagramBox> {
	return row.map((box) => (typeof box === "string" ? { label: box } : box));
}
