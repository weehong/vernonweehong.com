import Link from "next/link";
import { ButtonGroup, buttonClasses } from "@/components/ui/buttons";
import { ArrowIcon } from "@/components/ui/icons";

export function PostActions({
	thoughts,
	contactMe,
	contactHref,
}: {
	readonly thoughts: string;
	readonly contactMe: string;
	readonly contactHref: string;
}): React.ReactElement {
	return (
		<div className="flex flex-wrap items-center justify-between gap-4 border-y border-rule py-5">
			<p className="text-body-sm text-ink-soft">{thoughts}</p>
			<ButtonGroup>
				<Link href={contactHref} className={buttonClasses.primary}>
					{contactMe}
					<ArrowIcon />
				</Link>
			</ButtonGroup>
		</div>
	);
}
