import type { Topic } from "@/components/ui/chips";

/** A large button that sets the topic filter. */
export function TopicBlock({
	topic,
	name,
	description,
	count,
	unit,
	onPick,
}: {
	readonly topic: Topic;
	readonly name: string;
	readonly description: string;
	/** Number of posts in the topic, shown a step larger than the title. */
	readonly count: number;
	/** The word after the number ("posts" / "篇"), shown small. */
	readonly unit: string;
	readonly onPick: (topic: Topic) => void;
}): React.ReactElement {
	return (
		<button
			type="button"
			onClick={() => {
				onPick(topic);
			}}
			className={
				topic === "reflections"
					? "flex min-h-55 cursor-pointer flex-col gap-2.5 rounded-md border-0 p-7 text-left font-sans bg-marker dots-on-marker text-marker-ink bg-top-right"
					: "flex min-h-55 cursor-pointer flex-col gap-2.5 rounded-md border-0 p-7 text-left font-sans bg-night dots-on-night text-on-night bg-top-right"
			}
		>
			<span className="font-display text-title [font-weight:var(--weight-display)]">
				{name}
			</span>
			<span className="my-auto flex items-baseline gap-2 self-end">
				<span className="font-display text-numeral tabular-nums">{count}</span>
				<span className="font-mono text-label normal-case tracking-normal">
					{unit}
				</span>
			</span>
			<span className="flex items-end justify-between gap-3 text-body-sm">
				{description}
				<span aria-hidden className="text-2xl">
					→
				</span>
			</span>
		</button>
	);
}
