/** Buttons (docs/design/components.md, Buttons). Class strings are normative. */

const base =
	"inline-flex items-center gap-2 rounded-sm text-body-sm font-medium no-underline cursor-pointer";

export const buttonClasses = {
	primary: `${base} min-h-12 px-5.5 bg-night text-on-night hover:bg-marker hover:text-marker-ink`,
	secondary: `${base} min-h-11 px-4.5 border border-field-line text-ink hover:border-ink`,
	onMarkerSubmit: `${base} min-h-12 px-6 bg-night text-on-night font-semibold`,
	onNightSubmit: `${base} min-h-12 px-6 bg-marker text-marker-ink font-semibold hover:bg-on-night hover:text-night`,
} as const;

/** Always right-aligned, primary action last. */
export function ButtonGroup({
	children,
}: {
	readonly children: React.ReactNode;
}): React.ReactElement {
	return <div className="flex flex-wrap justify-end gap-3">{children}</div>;
}
