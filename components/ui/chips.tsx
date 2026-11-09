/** Badges, tags and chips (docs/design/components.md). */

type ChildrenProps = { readonly children: React.ReactNode };

export function AvailabilityBadge({
	children,
}: ChildrenProps): React.ReactElement {
	return (
		<span className="inline-flex items-center gap-2 rounded-pill bg-signal-bg py-1 pr-3 pl-2.5 font-mono text-meta font-medium text-signal">
			<span aria-hidden className="size-2 rounded-pill bg-signal" />
			{children}
		</span>
	);
}

export function Tag({ children }: ChildrenProps): React.ReactElement {
	return (
		<span className="rounded-xs bg-marker px-2 py-1 font-mono text-label normal-case tracking-normal font-medium text-marker-ink">
			{children}
		</span>
	);
}

export function TagRow({
	tags,
}: {
	readonly tags: ReadonlyArray<string>;
}): React.ReactElement | null {
	if (tags.length === 0) return null;
	return (
		<div className="flex flex-wrap gap-2">
			{tags.map((tag) => (
				<Tag key={tag}>{tag}</Tag>
			))}
		</div>
	);
}

export type Topic = "tech" | "reflections";

export function TopicChip({
	topic,
	children,
}: ChildrenProps & { readonly topic: Topic }): React.ReactElement {
	return topic === "tech" ? (
		<span className="rounded-xs bg-night px-2 py-0.5 font-mono text-label normal-case tracking-normal text-on-night">
			{children}
		</span>
	) : (
		<span className="rounded-xs bg-marker px-2 py-0.5 font-mono text-label normal-case tracking-normal text-marker-ink">
			{children}
		</span>
	);
}

/** "Current" (marker) or a project label (night). */
export function StatusChip({
	tone = "marker",
	children,
}: ChildrenProps & { readonly tone?: "marker" | "night" }): React.ReactElement {
	return tone === "night" ? (
		<span className="self-start rounded-xs bg-night px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-label text-on-night">
			{children}
		</span>
	) : (
		<span className="self-start rounded-xs bg-marker px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-label text-marker-ink">
			{children}
		</span>
	);
}

export function SkillChip({
	daily,
	children,
}: ChildrenProps & { readonly daily: boolean }): React.ReactElement {
	return daily ? (
		<span className="rounded-xs bg-night px-2.5 py-1.5 font-mono text-meta text-on-night">
			{children}
		</span>
	) : (
		<span className="rounded-xs bg-sunken px-2.5 py-1.5 font-mono text-meta">
			{children}
		</span>
	);
}

export function SectionNumber({
	onNight = false,
	children,
}: ChildrenProps & { readonly onNight?: boolean }): React.ReactElement {
	return onNight ? (
		<span className="inline-flex h-7 min-w-7 items-center justify-center rounded-xs bg-marker font-mono text-label normal-case tracking-normal text-marker-ink">
			{children}
		</span>
	) : (
		<span className="inline-flex h-7 min-w-7 items-center justify-center rounded-xs bg-night font-mono text-label normal-case tracking-normal text-on-night">
			{children}
		</span>
	);
}
