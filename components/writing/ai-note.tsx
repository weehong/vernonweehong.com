/** "My ideas, polished with AI." — on the Writing index header. */
export function AiNote({
	title,
	note,
}: {
	readonly title: string;
	readonly note: string;
}): React.ReactElement {
	return (
		<p className="flex max-w-[40ch] items-start gap-2.5 rounded-sm bg-sunken px-3.5 py-2.5 text-left text-meta leading-[1.55] text-ink-soft">
			<span
				aria-hidden
				className="mt-[5px] size-2 shrink-0 rounded-[2px] bg-marker"
			/>
			<span>
				<strong className="font-semibold text-ink">{title}</strong> {note}
			</span>
		</p>
	);
}
