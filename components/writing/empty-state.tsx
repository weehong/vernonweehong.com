import { buttonClasses } from "@/components/ui/buttons";

export function EmptyState({
	title,
	hint,
	clear,
}: {
	readonly title: string;
	readonly hint: string;
	/** The clear button, shown only while a query or topic filter is active. */
	readonly clear?: { readonly label: string; readonly onClear: () => void };
}): React.ReactElement {
	return (
		<div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-md border border-dashed border-field-line bg-raised p-8">
			<div className="flex flex-[1_1_320px] flex-col gap-1.5">
				<p className="font-display text-title-sm">{title}</p>
				<p className="text-ink-soft">{hint}</p>
			</div>
			{clear && (
				<button
					type="button"
					onClick={clear.onClear}
					className={buttonClasses.primary}
				>
					{clear.label}
				</button>
			)}
		</div>
	);
}
