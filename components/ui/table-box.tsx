/**
 * The box every table sits in (homepage and posts): it scrolls sideways on
 * narrow screens, and down too when the caller caps its height (posts), so it
 * is a focusable, labelled region that keyboard users can Tab into and scroll
 * with the arrow keys.
 */
export function TableBox({
	label,
	className = "",
	children,
}: {
	/** From the dictionary (`tableScroll`). */
	readonly label: string;
	/** Extra classes from the caller, such as `my-1 max-h-120` in posts. */
	readonly className?: string;
	readonly children: React.ReactNode;
}): React.ReactElement {
	return (
		<div
			role="region"
			aria-label={label}
			tabIndex={0}
			className={`overflow-auto rounded-md border border-rule bg-raised ${className}`}
		>
			<table className="w-full min-w-[520px] border-collapse text-left text-body-sm">
				{children}
			</table>
		</div>
	);
}
