import type { Topic } from "@/components/ui/chips";

/** Before the first post of each year (archive view only). Alternates night / marker. */
export function YearSeparator({
	year,
	countLabel,
	night,
	topicCounts,
}: {
	readonly year: string;
	readonly countLabel: string;
	/** The first year shown is night, then they alternate. */
	readonly night: boolean;
	readonly topicCounts: ReadonlyArray<{
		readonly topic: Topic;
		readonly name: string;
		readonly n: number;
	}>;
}): React.ReactElement {
	return (
		<div
			role="separator"
			aria-label={`${year}, ${countLabel}`}
			className={
				night
					? "mt-10 mb-2 first:mt-2 flex min-h-37.5 flex-wrap items-end justify-between gap-x-8 gap-y-3 rounded-md px-7 py-6 bg-top-right bg-night dots-on-night text-on-night"
					: "mt-10 mb-2 first:mt-2 flex min-h-37.5 flex-wrap items-end justify-between gap-x-8 gap-y-3 rounded-md px-7 py-6 bg-top-right bg-marker dots-on-marker text-marker-ink"
			}
		>
			<div className="flex flex-col gap-2.5">
				<span className="font-mono text-label normal-case tracking-normal">
					{countLabel}
				</span>
				<span className="font-display text-numeral-lg">{year}</span>
			</div>
			<div className="flex flex-wrap justify-end gap-2">
				{topicCounts.map((count) => (
					<span
						key={count.topic}
						className={
							night
								? "inline-flex items-baseline gap-2.5 rounded-sm px-4.5 py-3 bg-paper text-ink"
								: "inline-flex items-baseline gap-2.5 rounded-sm px-4.5 py-3 bg-night text-on-night"
						}
					>
						<span className="font-display text-numeral">{count.n}</span>
						<span className="font-mono text-meta font-medium">
							{count.name}
						</span>
					</span>
				))}
			</div>
		</div>
	);
}
