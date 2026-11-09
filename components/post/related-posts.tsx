import Link from "next/link";

export type RelatedPost = {
	readonly href: string;
	readonly title: string;
	readonly topicName: string;
	readonly minutesLabel: string;
};

/** "You might also like": two posts, never "Previous / Next". */
export function RelatedPosts({
	title,
	posts,
}: {
	readonly title: string;
	readonly posts: ReadonlyArray<RelatedPost>;
}): React.ReactElement | null {
	if (posts.length === 0) return null;
	return (
		<section aria-labelledby="related-title" className="flex flex-col gap-4">
			<h2
				id="related-title"
				className="font-display text-[28px] font-extrabold tracking-title"
			>
				{title}
			</h2>
			<div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
				{posts.map((post, index) => (
					<Link
						key={post.href}
						href={post.href}
						className={
							index === 0
								? "flex min-h-45 flex-col gap-3 rounded-md px-7 py-6 bg-top-right no-underline bg-night dots-on-night text-on-night"
								: "flex min-h-45 flex-col gap-3 rounded-md px-7 py-6 bg-top-right no-underline bg-marker dots-on-marker text-marker-ink"
						}
					>
						<span className="flex items-center justify-between gap-2.5 font-mono text-label uppercase">
							{post.topicName} · {post.minutesLabel}
							<span
								aria-hidden
								className="font-display text-[28px] normal-case tracking-normal leading-none"
							>
								→
							</span>
						</span>
						<span className="mt-auto font-display text-title-md">
							{post.title}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}
