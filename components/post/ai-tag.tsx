/** "Polished with AI" — last item in every post's PostMeta. */
export function AiTag({
	label,
}: {
	readonly label: string;
}): React.ReactElement {
	return (
		<span className="rounded-xs bg-sunken px-2 py-0.5 font-mono text-label normal-case tracking-normal text-ink-soft">
			{label}
		</span>
	);
}
