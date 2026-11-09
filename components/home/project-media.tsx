import type { DiagramBox } from "@/lib/content/localize";

export type ProjectMediaData =
	| {
			readonly kind: "phones-placeholder";
			readonly captions: ReadonlyArray<string>;
	  }
	| {
			readonly kind: "diagram";
			readonly ariaLabel: string;
			readonly rows: ReadonlyArray<ReadonlyArray<DiagramBox>>;
	  };

const boxClass: Record<"plain" | "marker" | "night", string> = {
	plain: "rounded-sm border border-ink bg-raised px-3 py-2",
	marker: "rounded-sm border border-ink bg-marker px-3 py-2 text-marker-ink",
	night: "rounded-sm bg-night px-3 py-2 text-on-night",
};

const phone =
	"flex h-49 w-24 items-center justify-center rounded-[18px] border-2 border-marker-ink bg-paper text-center font-mono text-[10px] text-ink-soft";

/** The left half of a ProjectCard: a phone placeholder or a flow diagram. */
export function ProjectMedia({
	media,
}: {
	readonly media: ProjectMediaData;
}): React.ReactElement {
	if (media.kind === "phones-placeholder") {
		return (
			<div
				aria-hidden
				className="box-border flex min-h-75 flex-[1_1_320px] items-center justify-center gap-4 bg-marker dots-on-marker p-8"
			>
				{media.captions.map((caption, index) => (
					<div
						key={caption}
						className={index === 1 ? `-mt-10 ${phone}` : phone}
					>
						{caption}
					</div>
				))}
			</div>
		);
	}
	return (
		<figure
			aria-label={media.ariaLabel}
			className="m-0 box-border flex min-h-75 min-w-0 flex-[1_1_320px] flex-col justify-center gap-2.5 bg-sunken dots-subtle p-8 font-mono text-meta"
		>
			{media.rows.map((row, rowIndex) => (
				<div
					key={row.map((box) => box.label).join("|")}
					className="flex flex-wrap items-center gap-2"
				>
					{rowIndex > 0 && (
						<span aria-hidden className="text-ink-muted">
							↳
						</span>
					)}
					{row.map((box, index) => (
						<span key={box.label} className="contents">
							<span className={boxClass[box.emphasis ?? "plain"]}>
								{box.label}
							</span>
							{index < row.length - 1 && (
								<span aria-hidden className="text-ink-muted">
									→
								</span>
							)}
						</span>
					))}
				</div>
			))}
		</figure>
	);
}
