import { TopicChip, type Topic } from "@/components/ui/chips";
import { AiTag } from "@/components/post/ai-tag";

/** Topic · date · minutes (· AiTag on the post page). */
export function PostMeta({
	topic,
	topicName,
	date,
	dateTime,
	minutesLabel,
	aiTag,
}: {
	readonly topic: Topic;
	readonly topicName: string;
	readonly date: string;
	readonly dateTime: string;
	readonly minutesLabel: string;
	readonly aiTag?: string;
}): React.ReactElement {
	return (
		<p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-meta text-ink-muted">
			<TopicChip topic={topic}>{topicName}</TopicChip>
			<span aria-hidden>·</span>
			<time dateTime={dateTime}>{date}</time>
			<span aria-hidden>·</span>
			<span>{minutesLabel}</span>
			{aiTag && (
				<>
					<span aria-hidden>·</span>
					<AiTag label={aiTag} />
				</>
			)}
		</p>
	);
}
