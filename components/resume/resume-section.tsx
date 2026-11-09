import { SectionNumber } from "@/components/ui/chips";

/**
 * One resume section: Summary, Skills, Experience, Projects, Awards,
 * Education. The label is the homepage SectionLabel on screen and a plain
 * heading in print.
 */
export function ResumeSection({
	n,
	title,
	children,
}: {
	readonly n: number;
	readonly title: string;
	readonly children: React.ReactNode;
}): React.ReactElement {
	return (
		<section className="flex flex-col gap-6 print:gap-[6pt]">
			<h2 className="flex items-center gap-3 border-b-2 border-rule-strong pb-3 font-mono text-label uppercase print:block print:border-b print:border-rule print:pb-[2pt] print:font-sans print:text-[9pt] print:font-bold print:text-ink">
				<span className="print:hidden">
					<SectionNumber>§{n}</SectionNumber>
				</span>
				{title}
			</h2>
			{children}
		</section>
	);
}
