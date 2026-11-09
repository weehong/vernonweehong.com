/** One resume section: Summary, Skills, Experience, Projects, Awards, Education. */
export function ResumeSection({
	title,
	children,
}: {
	readonly title: string;
	readonly children: React.ReactNode;
}): React.ReactElement {
	return (
		<section className="flex flex-col gap-6 print:gap-[6pt]">
			<h2 className="font-mono text-label uppercase text-ink-muted print:border-b print:border-rule print:pb-[2pt] print:font-sans print:text-[9pt] print:font-bold print:text-ink">
				{title}
			</h2>
			{children}
		</section>
	);
}
