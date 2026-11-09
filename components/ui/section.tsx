import { SectionNumber } from "@/components/ui/chips";
import { Highlight, type HighlightedText } from "@/components/ui/highlight";

/** The numbered rule line (Writing index sections use only this). */
export function SectionLabel({
	n,
	label,
}: {
	readonly n: number;
	readonly label: string;
}): React.ReactElement {
	return (
		<p className="flex items-center gap-3 border-b-2 border-rule-strong pb-3 font-mono text-label uppercase">
			<SectionNumber>§{n}</SectionNumber>
			{label}
		</p>
	);
}

type HeadingProps = {
	readonly n: number;
	readonly label: string;
	readonly heading: HighlightedText | string;
	/** English long sentences get `max-w-[20ch]`; never Chinese. */
	readonly narrow?: boolean;
};

export function SectionHeading({
	n,
	label,
	heading,
	narrow = false,
}: HeadingProps): React.ReactElement {
	return (
		<header className="flex flex-col gap-4">
			<SectionLabel n={n} label={label} />
			<h2
				className={
					narrow
						? "max-w-[20ch] font-display text-heading"
						: "font-display text-heading"
				}
			>
				{typeof heading === "string" ? heading : <Highlight text={heading} />}
			</h2>
		</header>
	);
}

/** A homepage section block (every section after the hero). */
export function Section({
	id,
	children,
	...heading
}: HeadingProps & {
	readonly id: string;
	readonly children: React.ReactNode;
}): React.ReactElement {
	return (
		<section id={id} className="flex flex-col gap-10 pt-30">
			<SectionHeading {...heading} />
			{children}
		</section>
	);
}
