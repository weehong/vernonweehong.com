/** Directly after every post body: how the post was written. */
export function HowWritten({
	title,
	body,
}: {
	readonly title: string;
	readonly body: string;
}): React.ReactElement {
	return (
		<aside
			aria-label={title}
			className="flex max-w-reading items-start gap-3.5 rounded-md border border-dashed border-field-line bg-raised px-5 py-4.5"
		>
			<span
				aria-hidden
				className="mt-1.5 size-2.5 shrink-0 rounded-[2px] bg-marker"
			/>
			<div className="flex flex-col gap-1">
				<strong className="font-display text-lg font-bold">{title}</strong>
				<p className="text-body-sm text-ink-soft">{body}</p>
			</div>
		</aside>
	);
}
