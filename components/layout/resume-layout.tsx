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
		<div className="mx-auto max-w-[960px] px-8 pt-12 pb-24 max-sm:px-0 max-sm:pt-6 max-sm:pb-0 print:max-w-none print:px-[16mm] print:py-[14mm] print:[box-decoration-break:clone]">
			<ResumeActions
				homeHref={localePath(locale, "/")}
				pdfHref={localePath(locale, "/resume.pdf")}
				fileName={resumeFileName(locale)}
				dictionary={dictionary}
			/>
			{/* The sheet: a sheet of paper on screen, plain page in print. */}
			<main className="flex flex-col gap-14 rounded-xs border border-rule bg-raised px-12 py-14 shadow-lift max-sm:rounded-none max-sm:border-x-0 max-sm:border-b-0 max-sm:px-5 max-sm:py-10 print:gap-[10pt] print:rounded-none print:border-0 print:p-0 print:shadow-none">
				{children}
			</main>
		</div>
	);
}
