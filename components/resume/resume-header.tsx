import type { Resume } from "@/lib/resume";

function displayUrl(href: string): string {
	return href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function ResumeHeader({
	kicker,
	header,
	updated,
	card,
}: {
	readonly kicker: string;
	readonly header: Resume["header"];
	/** The ResumeUpdated stamp, shown opposite the kicker. */
	readonly updated: React.ReactNode;
	/** The homepage ProfileCardPanel, beside the name (screen only). */
	readonly card: React.ReactNode;
}): React.ReactElement {
	return (
		<header className="flex flex-col gap-8 print:gap-0 print:border-b-2 print:border-rule-strong print:pb-[7pt]">
			<div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
				<p className="font-mono text-label uppercase text-ink-muted">
					{kicker}
				</p>
				{updated}
			</div>
			<div className="flex flex-wrap items-end gap-x-10 gap-y-8">
				<div className="flex min-w-0 flex-[999_1_400px] flex-col gap-3 print:gap-[3pt]">
					<h1 className="font-display text-display-md print:text-[22pt] print:tracking-normal">
						Vernon Wee Hong <span className="text-ink">KOH</span>
					</h1>
					<p className="font-display text-title-sm text-ink-soft print:text-[11pt]">
						<mark className="highlight">{header.title}</mark> ·{" "}
						{header.location}
					</p>
					<ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 font-mono text-meta print:gap-x-[14pt] print:font-sans print:text-[8.5pt]">
						<li>
							<a
								href={`mailto:${header.email}`}
								className="text-ink no-underline"
							>
								{header.email}
							</a>
						</li>
						{/* On paper nobody can click through, so print the site address too. */}
						<li className="hidden print:block">{header.site}</li>
						{header.links.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									aria-label={link.label}
									rel="me noreferrer"
									className="text-ink no-underline"
								>
									{displayUrl(link.href)}
								</a>
							</li>
						))}
					</ul>
				</div>
				<div className="flex min-w-0 flex-[1_1_300px] print:hidden">{card}</div>
			</div>
		</header>
	);
}
