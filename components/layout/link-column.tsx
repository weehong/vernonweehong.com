"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export type PageSection = { readonly id: string; readonly label: string };

export type ElsewhereItem = {
	readonly href: string;
	readonly label: string;
	/** ← back, → same site, ↗ external */
	readonly glyph: "←" | "→" | "↗";
};

export type LinkColumnProps = {
	readonly sections: ReadonlyArray<PageSection>;
	readonly links: ReadonlyArray<ElsewhereItem>;
	readonly labels: {
		readonly pageLinks: string;
		readonly onThisPage: string;
		readonly elsewhere: string;
		readonly themeToDark: string;
		readonly themeToLight: string;
	};
	/** "column": the desktop aside (hidden below lg). "menu": inside SiteMenu. */
	readonly variant?: "column" | "menu";
	/** Called when a link is followed (SiteMenu closes itself). */
	readonly onNavigate?: () => void;
};

/**
 * Scroll-spy: the current section is the last one whose top has passed the
 * reading line (40% down the viewport, and never above the sticky offset).
 * Counting from the last section means a sticky section (the Writing
 * SearchBar), which is always on screen, cannot hold the highlight.
 */
function useCurrentSection(ids: ReadonlyArray<string>): string | undefined {
	const key = ids.join(" ");
	const [current, setCurrent] = useState<string | undefined>(ids[0]);
	useEffect(() => {
		const sectionIds = key === "" ? [] : key.split(" ");
		if (sectionIds.length === 0) return;
		let frame = 0;
		const update = (): void => {
			frame = 0;
			const offset =
				Number.parseFloat(
					getComputedStyle(document.documentElement).scrollPaddingTop
				) || 0;
			const line = Math.max(window.innerHeight * 0.4, offset + 8);
			let next = sectionIds[0];
			for (const id of sectionIds) {
				const element = document.getElementById(id);
				if (element && element.getBoundingClientRect().top <= line) next = id;
			}
			setCurrent(next);
		};
		const schedule = (): void => {
			if (frame === 0) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		return (): void => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
		};
	}, [key]);
	return current;
}

export function LinkColumn({
	sections,
	links,
	labels,
	variant = "column",
	onNavigate,
}: LinkColumnProps): React.ReactElement {
	const current = useCurrentSection(sections.map((section) => section.id));
	const Root = variant === "column" ? "aside" : "div";
	return (
		<Root
			{...(variant === "column" ? { "aria-label": labels.pageLinks } : {})}
			className={
				variant === "column"
					? "flex flex-[1_1_200px] flex-col gap-8 pt-18 max-lg:hidden lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
					: "flex flex-col gap-8"
			}
		>
			<nav aria-label={labels.onThisPage} className="flex flex-col gap-2">
				<div className="mb-1 flex items-center justify-between gap-3">
					<p className="pl-3 font-mono text-label uppercase text-ink-muted">
						{labels.onThisPage}
					</p>
					<ThemeToggle
						toDark={labels.themeToDark}
						toLight={labels.themeToLight}
					/>
				</div>
				{sections.map((section, index) => (
					<a
						key={section.id}
						href={`#${section.id}`}
						aria-current={current === section.id ? "true" : undefined}
						onClick={onNavigate}
						className="flex min-h-11 items-center gap-3 rounded-sm px-3 text-body-sm text-ink-soft no-underline hover:text-ink aria-[current=true]:bg-marker aria-[current=true]:font-medium aria-[current=true]:text-marker-ink"
					>
						<span className="font-mono text-label normal-case tracking-normal text-ink-muted [[aria-current=true]>&]:text-marker-ink">
							§{index + 1}
						</span>
						{section.label}
					</a>
				))}
			</nav>
			<nav
				aria-label={labels.elsewhere}
				className="flex flex-col gap-1 border-t border-rule pt-6"
			>
				<p className="mb-1 pl-3 font-mono text-label uppercase text-ink-muted">
					{labels.elsewhere}
				</p>
				{links.map((link) =>
					link.glyph === "↗" ? (
						<a
							key={link.href}
							href={link.href}
							rel="me noreferrer"
							onClick={onNavigate}
							className="flex min-h-11 items-center justify-between px-3 font-mono text-small text-ink no-underline hover:underline"
						>
							{link.label}
							<span aria-hidden>{link.glyph}</span>
						</a>
					) : (
						<Link
							key={link.href}
							href={link.href}
							onClick={onNavigate}
							className="flex min-h-11 items-center justify-between px-3 font-mono text-small text-ink no-underline hover:underline"
						>
							{link.label}
							<span aria-hidden>{link.glyph}</span>
						</Link>
					)
				)}
			</nav>
		</Root>
	);
}
