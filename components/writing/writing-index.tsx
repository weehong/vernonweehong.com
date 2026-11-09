"use client";

import { useEffect, useMemo, useState } from "react";
import { ArchiveRow } from "@/components/writing/archive-row";
import type { ArchiveEntry } from "@/components/writing/archive-entry";
import {
	ArchiveToolbar,
	type TopicFilter,
} from "@/components/writing/archive-toolbar";
import { EmptyState } from "@/components/writing/empty-state";
import { FeaturedPost } from "@/components/writing/featured-post";
import { SearchBar } from "@/components/writing/search-bar";
import { TopicBlock } from "@/components/writing/topic-block";
import { YearSeparator } from "@/components/writing/year-separator";
import type { Topic } from "@/components/ui/chips";
import { SectionLabel } from "@/components/ui/section";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/locales";
import {
	search,
	toParts,
	type Part,
	type SearchablePost,
} from "@/lib/writing/search";

type Row = {
	readonly post: ArchiveEntry;
	readonly title: ReadonlyArray<Part>;
	readonly line: ReadonlyArray<Part>;
	readonly whereLabel?: string;
};

const TOPICS: ReadonlyArray<Topic> = ["reflections", "tech"];

/**
 * The Writing index below the header: search, Latest, Topics and the archive.
 * Owns the query and the topic filter so the page stays a server component.
 */
export function WritingIndex({
	posts,
	indexUrl,
	chinese,
	dictionary,
}: {
	readonly posts: ReadonlyArray<ArchiveEntry>;
	/** The edition's search-index JSON (post bodies), loaded on first search. */
	readonly indexUrl: string;
	readonly chinese: boolean;
	readonly dictionary: Dictionary;
}): React.ReactElement {
	const [query, setQuery] = useState("");
	const [topic, setTopic] = useState<TopicFilter>("all");
	const [index, setIndex] = useState<ReadonlyArray<SearchablePost>>();
	const trimmed = query.trim();
	const browsing = trimmed === "" && topic === "all";

	useEffect(() => {
		if (trimmed === "" || index) return;
		let cancelled = false;
		fetch(indexUrl)
			.then(
				async (response) => (await response.json()) as Array<SearchablePost>
			)
			.then((entries) => {
				if (!cancelled) setIndex(entries);
			})
			.catch(() => {
				// Without the bodies, search still covers titles, summaries and topics.
				if (!cancelled) setIndex(posts.map((post) => ({ ...post, body: "" })));
			});
		return (): void => {
			cancelled = true;
		};
	}, [trimmed, index, indexUrl, posts]);

	const rows = useMemo((): ReadonlyArray<Row> => {
		const inTopic = (entry: { readonly topic: Topic }): boolean =>
			topic === "all" || entry.topic === topic;
		if (trimmed === "") {
			return posts.filter(inTopic).map((post) => ({
				post,
				title: [{ text: post.title, hit: false }],
				line: toParts(post.summary, []),
			}));
		}
		const bySlug = new Map(posts.map((post) => [post.slug, post]));
		const source = index ?? posts.map((post) => ({ ...post, body: "" }));
		return search(source, trimmed, chinese).flatMap((result) => {
			const post = bySlug.get(result.post.slug);
			if (!post || !inTopic(post)) return [];
			const where = result.where
				.map((field) => dictionary.matchWhere[field])
				.join(chinese ? "、" : " + ");
			return [
				{
					post,
					title: result.title,
					line: result.line,
					whereLabel: `${dictionary.matchedIn}${chinese ? "" : " "}${where}`,
				},
			];
		});
	}, [posts, index, trimmed, topic, chinese, dictionary]);

	const postsLabel = (n: number): string =>
		fill(n === 1 ? dictionary.count.post : dictionary.count.posts, { n });
	const countLabel =
		trimmed === ""
			? postsLabel(rows.length)
			: fill(
					rows.length === 1 ? dictionary.count.match : dictionary.count.matches,
					{ n: rows.length, q: trimmed }
				);
	const topicName = (value: Topic): string => dictionary.topics[value];
	// TopicBlock shows the number large and the word ("posts" / "篇") small.
	const topicCount = (
		value: Topic
	): { readonly count: number; readonly unit: string } => {
		const count = posts.filter((post) => post.topic === value).length;
		const template =
			count === 1 ? dictionary.count.post : dictionary.count.posts;
		return { count, unit: template.replace("{n}", "").trim() };
	};
	const latest = posts[0];
	const reset = (): void => {
		setQuery("");
		setTopic("all");
	};

	// Year separators: archive view only (hidden while searching).
	const years =
		trimmed === ""
			? [...new Set(rows.map((row) => row.post.publishedOn.slice(0, 4)))]
			: [];

	return (
		<>
			<SearchBar
				query={query}
				onQueryChange={setQuery}
				text={dictionary.search}
			/>

			{browsing && latest && (
				<section id="latest" className="flex flex-col gap-6">
					<SectionLabel n={2} label={dictionary.nav.latest} />
					<FeaturedPost
						post={latest}
						label={dictionary.newThisMonth}
						readPost={dictionary.readPost}
					/>
				</section>
			)}

			{browsing && (
				<section id="topics" className="flex flex-col gap-6">
					<SectionLabel n={3} label={dictionary.nav.topics} />
					<div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
						{TOPICS.map((value) => (
							<TopicBlock
								key={value}
								topic={value}
								name={topicName(value)}
								description={
									value === "tech"
										? dictionary.topics.techDesc
										: dictionary.topics.reflectionsDesc
								}
								{...topicCount(value)}
								onPick={setTopic}
							/>
						))}
					</div>
				</section>
			)}

			<section id="archive" className="flex flex-col gap-5">
				<SectionLabel n={4} label={dictionary.nav.archive} />
				<ArchiveToolbar
					countLabel={countLabel}
					topic={topic}
					onTopicChange={setTopic}
					labels={{
						group: dictionary.topicGroup,
						all: dictionary.allTopics,
						reflections: dictionary.topics.reflections,
						tech: dictionary.topics.tech,
					}}
				/>
				<div className="flex flex-col">
					{rows.flatMap((row, position) => {
						const year = row.post.publishedOn.slice(0, 4);
						const startsYear =
							trimmed === "" &&
							rows[position - 1]?.post.publishedOn.slice(0, 4) !== year;
						const inYear = rows.filter((other) =>
							other.post.publishedOn.startsWith(year)
						);
						return [
							...(startsYear
								? [
										<YearSeparator
											key={`year-${year}`}
											year={year}
											countLabel={postsLabel(inYear.length)}
											night={years.indexOf(year) % 2 === 0}
											topicCounts={TOPICS.map((value) => ({
												topic: value,
												name: topicName(value),
												n: inYear.filter((other) => other.post.topic === value)
													.length,
											})).filter((count) => count.n > 0)}
										/>,
									]
								: []),
							<ArchiveRow
								key={row.post.slug}
								post={row.post}
								afterSeparator={startsYear}
								title={row.title}
								line={row.line}
								{...(row.whereLabel ? { whereLabel: row.whereLabel } : {})}
							/>,
						];
					})}
					{rows.length > 0 && <div className="border-t border-rule" />}
					{rows.length === 0 && (
						<EmptyState
							title={
								trimmed === ""
									? dictionary.empty.noPostsTitle
									: fill(dictionary.empty.title, { q: trimmed })
							}
							hint={
								trimmed === ""
									? dictionary.empty.noPostsHint
									: dictionary.empty.hint
							}
							{...(browsing
								? {}
								: {
										clear: { label: dictionary.empty.clear, onClear: reset },
									})}
						/>
					)}
				</div>
			</section>
		</>
	);
}
