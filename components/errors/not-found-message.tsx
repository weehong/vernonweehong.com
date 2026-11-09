import Link from "next/link";
import { ButtonGroup, buttonClasses } from "@/components/ui/buttons";
import { ArrowIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function NotFoundMessage({
	homeHref,
	dictionary,
}: {
	readonly homeHref: string;
	readonly dictionary: Dictionary;
}): React.ReactElement {
	return (
		<>
			<p className="font-mono text-label uppercase text-ink-muted">
				{dictionary.notFound.kicker}
			</p>
			<h1 className="font-display text-display-xl">
				404
				<span className="text-marker [-webkit-text-stroke:2px_var(--ink)]">
					.
				</span>
			</h1>
			<p className="max-w-measure text-lead text-ink-soft">
				{dictionary.notFound.text}
			</p>
			<ButtonGroup>
				<Link href={homeHref} className={buttonClasses.primary}>
					{dictionary.notFound.home}
					<ArrowIcon />
				</Link>
			</ButtonGroup>
		</>
	);
}
