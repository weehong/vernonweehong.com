import { StatusChip, TagRow } from "@/components/ui/chips";
import { RichText } from "@/components/ui/highlight";
import type { Profile } from "@/lib/profile";

type ExperienceEntry = Profile["experience"]["entries"][number];

/** An Experience row: the 180px meta column, then role, outcomes and tags. */
export function Entry({
	entry,
	currentLabel,
}: {
	readonly entry: ExperienceEntry;
	readonly currentLabel: string;
}): React.ReactElement {
	const current = "current" in entry && entry.current === true;
	return (
		<article className="flex flex-wrap gap-x-8 gap-y-2 border-t border-rule py-7 last:border-b">
			<div className="flex flex-[0_0_180px] flex-col items-start gap-1.5 font-mono text-meta text-ink-muted">
				<strong className="font-medium text-ink">{entry.period}</strong>
				<span>{entry.location}</span>
				{current && <StatusChip>{currentLabel}</StatusChip>}
			</div>
			<div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3">
				<h3 className="font-display text-title-md">
					{entry.role}{" "}
					<span className="font-semibold text-ink-muted">
						· {entry.company}
					</span>
				</h3>
				<ul className="m-0 flex list-disc flex-col gap-1.5 pl-4.5 text-body-sm text-ink-soft marker:text-ink-muted">
					{entry.outcomes.map((outcome) => (
						<li key={outcome}>
							<RichText text={outcome} />
						</li>
					))}
				</ul>
				<TagRow tags={entry.tags} />
			</div>
		</article>
	);
}
