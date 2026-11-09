/** A resume row: the 180px meta column (shared with the homepage), then details. */
export function ResumeRow({
	meta,
	children,
}: {
	readonly meta: React.ReactNode;
	readonly children: React.ReactNode;
}): React.ReactElement {
	return (
		<div className="flex flex-wrap gap-x-8 gap-y-2">
			<div className="flex-[0_0_180px] font-mono text-meta tabular-nums">
				{meta}
			</div>
			<div className="min-w-0 flex-[1_1_360px]">{children}</div>
		</div>
	);
}
