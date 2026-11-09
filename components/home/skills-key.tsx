/** The key under the skills table. */
export function SkillsKey({
	label,
}: {
	readonly label: string;
}): React.ReactElement {
	return (
		<p className="flex items-center gap-1.5 font-mono text-label normal-case tracking-normal text-ink-muted">
			<span aria-hidden className="size-2.5 rounded-[2px] bg-night" />
			{label}
		</p>
	);
}
