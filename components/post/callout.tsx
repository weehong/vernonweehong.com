import {
	FlagIcon,
	InfoIcon,
	LightbulbIcon,
	OctagonIcon,
	TriangleIcon,
} from "@/components/ui/icons";
import type { CalloutKind } from "@/lib/writing/remark-post";

/** Default titles per kind, from the dictionary (`post.callout.*`). */
export type CalloutLabels = Readonly<Record<CalloutKind, string>>;

const STYLE: Record<
	CalloutKind,
	{
		readonly bar: string;
		readonly icon: string;
		readonly Icon: (props: {
			readonly className?: string;
		}) => React.ReactElement;
	}
> = {
	note: { bar: "bg-ink-muted", icon: "text-ink-muted", Icon: InfoIcon },
	tip: { bar: "bg-signal", icon: "text-signal", Icon: LightbulbIcon },
	important: { bar: "bg-marker", icon: "text-ink", Icon: FlagIcon },
	warning: { bar: "bg-warn", icon: "text-warn", Icon: TriangleIcon },
	caution: { bar: "bg-danger", icon: "text-danger", Icon: OctagonIcon },
};

/** A GitHub-style alert in a post (docs/design/components.md, Callout). */
export function Callout({
	kind,
	title,
	children,
}: {
	readonly kind: CalloutKind;
	/** The custom title, or the kind's default label. */
	readonly title: string;
	readonly children?: React.ReactNode;
}): React.ReactElement {
	const { bar, icon, Icon } = STYLE[kind];
	return (
		<div
			role="note"
			className="relative my-1 flex gap-3.5 overflow-hidden rounded-md border border-rule bg-raised py-4 pr-5 pl-6"
		>
			<span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
			<Icon className={`mt-0.5 size-5 shrink-0 ${icon}`} />
			<div className="flex min-w-0 flex-col gap-1.5">
				<p className="m-0 font-display text-lg font-bold text-ink">{title}</p>
				<div className="flex flex-col gap-3 text-body text-ink-soft">
					{children}
				</div>
			</div>
		</div>
	);
}
