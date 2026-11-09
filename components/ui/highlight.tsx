/** A heading split around its one highlighted phrase. */
export type HighlightedText = {
	readonly lead: string;
	readonly mark: string;
	readonly tail: string;
};

/**
 * Renders lead + <mark className="highlight"> + tail. Leads already carry
 * their own spacing (English ends with a space, Chinese does not), so nothing
 * is added or trimmed here.
 */
export function Highlight({
	text,
	draw = false,
}: {
	readonly text: HighlightedText;
	/** Hero statement only: the highlight draws in on first load. */
	readonly draw?: boolean;
}): React.ReactElement {
	return (
		<>
			{text.lead}
			<mark className={draw ? "highlight animate-mark-draw" : "highlight"}>
				{text.mark}
			</mark>
			{text.tail}
		</>
	);
}

/**
 * Text with `**…**` around numbers or results, rendered bold. Only `**` is
 * parsed; nothing else is Markdown.
 */
export function RichText({
	text,
}: {
	readonly text: string;
}): React.ReactElement {
	const parts = text.split(/\*\*(.+?)\*\*/g);
	return (
		<>
			{parts.map((part, index) =>
				index % 2 === 1 ? (
					<strong key={index} className="font-semibold text-ink">
						{part}
					</strong>
				) : (
					part
				)
			)}
		</>
	);
}
