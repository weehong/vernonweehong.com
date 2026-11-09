import Link from "next/link";
import type { ArchiveEntry } from "@/components/writing/archive-entry";
import { TopicChip } from "@/components/ui/chips";
import type { Part } from "@/lib/writing/search";

function Hits({
	parts,
}: {
	readonly parts: ReadonlyArray<Part>;
}): React.ReactElement {
	return (
		<>
			{parts.map((part, index) =>
				part.hit ? (
					<mark
						key={index}
						className="rounded-[2px] bg-marker px-0.5 text-marker-ink"
					>
						{part.text}
					</mark>
				) : (
					part.text
				)
			)}
		</>
	);
}

/** One archive row. The row right after a separator drops its top rule. */
export function ArchiveRow({
	post,
	afterSeparator,
	title,
	line,
	whereLabel,
}: {
	readonly post: ArchiveEntry;
	readonly afterSeparator: boolean;
	readonly title: ReadonlyArray<Part>;
	readonly line: ReadonlyArray<Part>;
	/** "Matched in title + text", while searching only. */
	readonly whereLabel?: string;
}): React.ReactElement {
	return (
		<article
			className={
				afterSeparator
					? "flex flex-wrap gap-x-8 gap-y-2 border-t border-rule border-t-transparent py-6"
					: "flex flex-wrap gap-x-8 gap-y-2 border-t border-rule py-6"
			}
		>
			<div className="flex flex-[0_0_180px] flex-col gap-1 font-mono text-meta text-ink-muted">
				<span className="mb-1.5 font-display text-numeral text-ink">
					{post.number}
				</span>
				<strong className="font-medium text-ink">{post.date}</strong>
				<span>{post.minutesLabel}</span>
			</div>
			<div className="flex min-w-0 flex-[1_1_360px] flex-col gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<TopicChip topic={post.topic}>{post.topicName}</TopicChip>
					{whereLabel && (
						<span className="font-mono text-label normal-case tracking-normal text-ink-muted">
							{whereLabel}
						</span>
					)}
				</div>
				<h3 className="font-display text-title-sm">
					<Link href={post.href} className="text-ink no-underline">
						<Hits parts={title} />
					</Link>
				</h3>
				<p className="text-body-sm text-ink-soft">
					<Hits parts={line} />
				</p>
			</div>
		</article>
	);
}
