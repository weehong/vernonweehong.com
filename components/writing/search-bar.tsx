"use client";

import { useEffect, useRef } from "react";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";

export type SearchBarText = {
	readonly label: string;
	readonly placeholder: string;
	readonly hint: string;
	readonly clear: string;
};

/** Space between the bar and a section heading after an anchor jump (px). */
const STICKY_GAP = 24;

function isField(target: EventTarget | null): boolean {
	return (
		target instanceof HTMLElement &&
		(target.isContentEditable ||
			["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
	);
}

/** Sticky search. `/` focuses it (unless already in a field); Esc clears it. */
export function SearchBar({
	query,
	onQueryChange,
	text,
}: {
	readonly query: string;
	readonly onQueryChange: (query: string) => void;
	readonly text: SearchBarText;
}): React.ReactElement {
	const input = useRef<HTMLInputElement>(null);
	const bar = useRef<HTMLDivElement>(null);

	// Anchor jumps and focus scrolling stop below the bar, not under it: the
	// base layer reads --sticky-top as the page's scroll-padding-top.
	useEffect(() => {
		const element = bar.current;
		if (!element) return;
		const root = document.documentElement;
		const observer = new ResizeObserver(() => {
			root.style.setProperty(
				"--sticky-top",
				`${Math.ceil(element.getBoundingClientRect().height) + STICKY_GAP}px`
			);
		});
		observer.observe(element);
		return (): void => {
			observer.disconnect();
			root.style.removeProperty("--sticky-top");
		};
	}, []);

	useEffect(() => {
		function onKey(event: KeyboardEvent): void {
			if (event.key === "/" && !isField(event.target)) {
				event.preventDefault();
				input.current?.focus();
			}
		}
		document.addEventListener("keydown", onKey);
		return (): void => {
			document.removeEventListener("keydown", onKey);
		};
	}, []);

	return (
		<div
			ref={bar}
			id="search"
			role="search"
			className="sticky top-0 z-10 -mt-11 flex flex-col gap-2.5 border-b border-rule bg-paper pt-5 pb-6"
		>
			<label
				htmlFor="writing-search"
				className="font-mono text-label uppercase text-ink-muted"
			>
				{text.label}
			</label>
			<div className="flex min-h-17 items-center gap-3 rounded-md border-2 border-ink bg-raised pr-2 pl-5 shadow-offset">
				<SearchIcon className="size-6 shrink-0 stroke-ink" />
				<input
					ref={input}
					id="writing-search"
					type="search"
					autoComplete="off"
					placeholder={text.placeholder}
					value={query}
					onChange={(event) => {
						onQueryChange(event.target.value);
					}}
					onKeyDown={(event) => {
						if (event.key === "Escape") onQueryChange("");
					}}
					className="h-16 min-w-0 flex-auto border-0 bg-transparent font-sans text-xl text-ink outline-none"
				/>
				{query ? (
					<button
						type="button"
						aria-label={text.clear}
						onClick={() => {
							onQueryChange("");
							input.current?.focus();
						}}
						className="inline-flex size-12 items-center justify-center rounded-sm bg-sunken text-ink"
					>
						<CloseIcon className="size-5" />
					</button>
				) : (
					<kbd
						aria-hidden
						className="mr-2 inline-flex h-8 min-w-8 items-center justify-center rounded-sm border border-b-2 border-field-line font-mono text-small text-ink-muted"
					>
						/
					</kbd>
				)}
			</div>
			<p className="font-mono text-label normal-case tracking-normal text-ink-muted">
				{text.hint}
			</p>
		</div>
	);
}
