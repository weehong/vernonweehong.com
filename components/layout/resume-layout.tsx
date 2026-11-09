import { ResumeActions } from "@/components/resume/resume-actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localePath, type Locale } from "@/lib/i18n/locales";
import { resumeFileName } from "@/lib/resume";

/** A single printable column: no header, link column or footer. */
export function ResumeLayout({
	locale,
	dictionary,
	children,
}: {
	readonly locale: Locale;
	readonly dictionary: Dictionary;
	readonly children: React.ReactNode;
}): React.ReactElement {
	return (
		<div className="mx-auto max-w-[880px] px-8 pt-12 pb-24 max-sm:px-5 print:max-w-none print:px-[16mm] print:py-[14mm] print:[box-decoration-break:clone]">
			<ResumeActions
				homeHref={localePath(locale, "/")}
				pdfHref={localePath(locale, "/resume.pdf")}
				fileName={resumeFileName(locale)}
				dictionary={dictionary}
			/>
			<main className="flex flex-col gap-14 print:gap-[10pt]">{children}</main>
		</div>
	);
}
