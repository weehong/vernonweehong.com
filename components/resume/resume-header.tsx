import type { Resume } from "@/lib/resume";

function displayUrl(href: string): string {
	return href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function ResumeHeader({
	kicker,
	header,
}: {
	readonly kicker: string;
	readonly header: Resume["header"];
}): React.ReactElement {
	return (
		<header className="flex flex-col gap-3 border-b-2 border-rule-strong pb-10 print:gap-[3pt] print:pb-[7pt]">
			<p className="font-mono text-label uppercase text-ink-muted print:hidden">
				{kicker}
			</p>
			<h1 className="font-display text-display-md print:text-[22pt] print:tracking-normal">
				Vernon Wee Hong <span className="text-ink">KOH</span>
			</h1>
			<p className="font-display text-title-sm text-ink-soft print:text-[11pt]">
				{header.title} · {header.location}
			</p>
			<ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 font-mono text-meta print:gap-x-[14pt] print:font-sans print:text-[8.5pt]">
				<li>
					<a href={`mailto:${header.email}`} className="text-ink no-underline">
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
		</header>
	);
}
