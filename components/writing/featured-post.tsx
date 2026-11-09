import Link from "next/link";
import { PostMeta } from "@/components/writing/post-meta";
import type { ArchiveEntry } from "@/components/writing/archive-entry";
import { buttonClasses } from "@/components/ui/buttons";
import { ArrowIcon } from "@/components/ui/icons";

export function FeaturedPost({
	post,
	label,
	readPost,
}: {
	readonly post: ArchiveEntry;
	readonly label: string;
	readonly readPost: string;
}): React.ReactElement {
	return (
		<article className="flex flex-wrap overflow-hidden rounded-md border border-rule bg-raised">
			<div
				aria-hidden
				className="flex min-h-75 flex-[1_1_300px] flex-col justify-between bg-marker dots-on-marker p-7 text-marker-ink"
			>
				<span className="font-mono text-label uppercase">{label}</span>
				<span className="font-display text-numeral-xl">{post.number}</span>
			</div>
			<div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3.5 p-7">
				<PostMeta
					topic={post.topic}
					topicName={post.topicName}
					date={post.date}
					dateTime={post.publishedOn}
					minutesLabel={post.minutesLabel}
				/>
				<h2 className="font-display text-title-lg">{post.title}</h2>
				<p className="text-[17px] text-ink-soft">{post.summary}</p>
				<Link
					href={post.href}
					className={`mt-auto self-end ${buttonClasses.primary}`}
				>
					{readPost}
					<ArrowIcon />
				</Link>
			</div>
		</article>
	);
}
