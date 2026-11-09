import Link from "next/link";
import { PostMeta } from "@/components/writing/post-meta";
import type { Topic } from "@/components/ui/chips";

export function PostHeader({
	indexHref,
	allWriting,
	topic,
	topicName,
	date,
	dateTime,
	minutesLabel,
	aiTag,
	title,
	highlight,
	standfirst,
}: {
	readonly indexHref: string;
	readonly allWriting: string;
	readonly topic: Topic;
	readonly topicName: string;
	readonly date: string;
	readonly dateTime: string;
	readonly minutesLabel: string;
	readonly aiTag: string;
	readonly title: string;
	/** Closing words of the title, drawn with the highlighter. */
	readonly highlight: string;
	readonly standfirst: string;
}): React.ReactElement {
	const lead = title.slice(0, title.length - highlight.length);
	return (
		<header className="flex flex-col gap-5 border-b-2 border-rule-strong pb-8">
			<Link
				href={indexHref}
				className="self-start inline-flex min-h-11 items-center font-mono text-meta text-ink-muted no-underline"
			>
				← {allWriting}
			</Link>
			<PostMeta
				topic={topic}
				topicName={topicName}
				date={date}
				dateTime={dateTime}
				minutesLabel={minutesLabel}
				aiTag={aiTag}
			/>
			<h1 className="max-w-[22ch] font-display text-display-md">
				{lead}
				<mark className="highlight">{highlight}</mark>
			</h1>
			<p className="text-lead text-ink-soft">{standfirst}</p>
		</header>
	);
}
