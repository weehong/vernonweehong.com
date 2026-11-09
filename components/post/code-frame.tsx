"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import type { CodeToken } from "@/lib/writing/highlight";

/** Blocks longer than this collapse; collapsed, they show `max-h-code-preview` (20 lines). */
const COLLAPSE_AFTER = 30;

export type CodeLabels = {
	readonly wrap: string;
	readonly showAll: string;
	readonly showFewer: string;
};

/**
 * The drawn code block (docs/design/components.md, CodeBlock): caption bar
 * with the wrap toggle, numbered lines, and a collapse for long blocks.
 */
export function CodeFrame({
	lines,
	lang,
	title,
	labels,
}: {
	readonly lines: ReadonlyArray<ReadonlyArray<CodeToken>>;
	readonly lang: string;
	readonly title?: string;
	readonly labels: CodeLabels;
}): React.ReactElement {
	const preId = useId();
	const toggle = useRef<HTMLButtonElement>(null);
	/** Where the collapse button was on screen before "Show fewer lines". */
	const anchor = useRef<number | null>(null);
	const [wrap, setWrap] = useState(false);
	const [expanded, setExpanded] = useState(false);
	/** Collapsed preview scrolled to its last line: the fade goes away. */
	const [atEnd, setAtEnd] = useState(false);
	const labelId = `${preId}-label`;
	const collapsible = lines.length > COLLAPSE_AFTER;
	const collapsed = collapsible && !expanded;

	// Collapsing removes up to thousands of pixels above the button; scroll by
	// the same amount so the button stays under the reader's pointer.
	useLayoutEffect(() => {
		const before = anchor.current;
		const button = toggle.current;
		if (before === null || !button) return;
		anchor.current = null;
		window.scrollBy({
			top: button.getBoundingClientRect().top - before,
			behavior: "instant",
		});
	}, [expanded]);

	const toggleExpanded = (): void => {
		if (expanded && toggle.current)
			anchor.current = toggle.current.getBoundingClientRect().top;
		setExpanded(!expanded);
	};

	return (
		<figure className="my-1 overflow-hidden rounded-md border border-rule bg-raised">
			<figcaption className="flex min-h-11 items-center justify-between gap-3 border-b border-rule bg-sunken pl-4 font-mono text-label normal-case tracking-normal text-ink-muted">
				<span {...(title ? { id: labelId } : {})} className="min-w-0 truncate">
					{title ?? ""}
				</span>
				<span className="flex shrink-0 items-center">
					<span {...(title ? {} : { id: labelId })}>{lang}</span>
					<button
						type="button"
						aria-pressed={wrap}
						aria-controls={preId}
						onClick={() => {
							setWrap(!wrap);
						}}
						className="group inline-flex min-h-11 cursor-pointer items-center gap-2 px-4 text-ink-muted hover:text-ink aria-pressed:text-ink print:hidden"
					>
						<span
							aria-hidden
							className="size-3 rounded-xs border border-current group-aria-pressed:bg-current"
						/>
						{labels.wrap}
					</button>
				</span>
			</figcaption>
			<div className="relative">
				{/* A scroll box (sideways always, down too while collapsed), so it takes focus for the keyboard. */}
				<pre
					id={preId}
					role="region"
					aria-labelledby={labelId}
					tabIndex={0}
					onScroll={(event) => {
						const box = event.currentTarget;
						setAtEnd(box.scrollTop + box.clientHeight >= box.scrollHeight - 1);
					}}
					className={`m-0 overflow-auto py-4 pr-5 font-mono text-code text-code-text focus-visible:-outline-offset-2 print:max-h-none ${
						collapsed ? "max-h-code-preview" : ""
					}`}
				>
					<code className={wrap ? "block" : "block w-max min-w-full"}>
						{lines.map((line, lineIndex) => (
							<span key={lineIndex} className="flex">
								<span
									aria-hidden
									className="w-12 shrink-0 select-none pr-4 text-right text-ink-muted"
								>
									{lineIndex + 1}
								</span>
								<span
									className={
										wrap
											? "min-w-0 whitespace-pre-wrap wrap-break-word"
											: "whitespace-pre"
									}
								>
									{line.map((token, tokenIndex) => (
										<span key={tokenIndex} className={token.className}>
											{token.content}
										</span>
									))}
									{line.length === 0 ? "\n" : null}
								</span>
							</span>
						))}
					</code>
				</pre>
				{collapsed && !atEnd && (
					<div
						aria-hidden
						className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-raised to-raised/0 print:hidden"
					/>
				)}
			</div>
			{collapsible && (
				<div className="flex justify-end border-t border-rule bg-sunken print:hidden">
					<button
						ref={toggle}
						type="button"
						aria-expanded={expanded}
						aria-controls={preId}
						onClick={toggleExpanded}
						className="inline-flex min-h-11 cursor-pointer items-center px-4 font-mono text-label normal-case tracking-normal text-ink-muted hover:text-ink"
					>
						{expanded ? labels.showFewer : labels.showAll}
					</button>
				</div>
			)}
		</figure>
	);
}
