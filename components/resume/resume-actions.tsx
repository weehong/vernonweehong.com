import Link from "next/link";
import { buttonClasses } from "@/components/ui/buttons";
import { DownloadIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Back link and the PDF download (screen only). */
export function ResumeActions({
	homeHref,
	pdfHref,
	fileName,
	dictionary,
}: {
	readonly homeHref: string;
	readonly pdfHref: string;
	readonly fileName: string;
	readonly dictionary: Dictionary;
}): React.ReactElement {
	return (
		<nav
			aria-label={dictionary.resume.actions}
			className="mb-12 flex flex-wrap items-center justify-between gap-3 max-sm:mb-6 max-sm:px-5 print:hidden"
		>
			<Link
				href={homeHref}
				className="inline-flex min-h-11 items-center font-mono text-meta text-ink-muted no-underline"
			>
				← {dictionary.resume.back}
			</Link>
			<a href={pdfHref} download={fileName} className={buttonClasses.primary}>
				{dictionary.resume.download}
				<DownloadIcon />
			</a>
		</nav>
	);
}
