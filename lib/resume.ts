import resume from "@/docs/design/copywriting/resume.json";
import { localize, type Localized } from "@/lib/content/localize";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

/**
 * The resume for one edition, read straight from the approved
 * docs/design/copywriting/resume.json (docs/design/pages.md, Profile).
 */
export type Resume = Localized<typeof resume>;

export function getResume(locale: Locale): Resume {
	return localize(resume, locale);
}

/** The PDF download name: "Vernon Wee Hong KOH - Resume.pdf" / "… - 简历.pdf". */
export function resumeFileName(locale: Locale): string {
	return `Vernon Wee Hong KOH - ${getDictionary(locale).resume.kicker}.pdf`;
}
