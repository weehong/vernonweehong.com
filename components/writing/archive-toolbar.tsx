import type { Topic } from "@/components/ui/chips";

export type TopicFilter = "all" | Topic;

/** Count line and the topic filter (no language filter). */
export function ArchiveToolbar({
	countLabel,
	topic,
	onTopicChange,
	labels,
}: {
	readonly countLabel: string;
	readonly topic: TopicFilter;
	readonly onTopicChange: (topic: TopicFilter) => void;
	readonly labels: {
		readonly group: string;
		readonly all: string;
		readonly reflections: string;
		readonly tech: string;
	};
}): React.ReactElement {
	const chips: ReadonlyArray<{
		readonly value: TopicFilter;
		readonly label: string;
	}> = [
		{ value: "all", label: labels.all },
		{ value: "reflections", label: labels.reflections },
		{ value: "tech", label: labels.tech },
	];
	return (
		<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
			<p role="status" className="font-mono text-meta text-ink-soft">
				{countLabel}
			</p>
			<div
				role="group"
				aria-label={labels.group}
				className="flex flex-wrap justify-end gap-1.5"
			>
				{chips.map((chip) => (
					<button
						key={chip.value}
						type="button"
						aria-pressed={topic === chip.value}
						onClick={() => {
							onTopicChange(chip.value);
						}}
						className="min-h-10 rounded-sm border border-field-line px-3.5 font-mono text-meta text-ink-soft cursor-pointer aria-pressed:border-marker aria-pressed:bg-marker aria-pressed:text-marker-ink"
					>
						{chip.label}
					</button>
				))}
			</div>
		</div>
	);
}
