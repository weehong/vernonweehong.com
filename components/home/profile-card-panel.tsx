import type { Profile } from "@/lib/profile";

/** The profile as an API response, on a dotted panel. */
export function ProfileCardPanel({
	card,
}: {
	readonly card: Profile["hero"]["profileCard"];
}): React.ReactElement {
	return (
		<div className="flex min-w-0 flex-[1_1_300px] items-end rounded-md bg-sunken dots-on-sunken pt-8 pl-8">
			<div className="min-w-0 flex-auto overflow-hidden rounded-tl-md rounded-br-md border border-ink bg-raised">
				<p className="flex flex-wrap justify-between gap-x-3 gap-y-1 border-b border-rule px-4 py-3 font-mono text-label normal-case tracking-normal text-ink-soft">
					<span>{card.request}</span>
					<span className="text-signal">{card.status}</span>
				</p>
				<dl className="grid grid-cols-[minmax(0,80px)_minmax(0,1fr)] gap-x-3 px-4 pt-1 pb-2 text-small">
					{card.rows.map((row, index) => {
						const last = index === card.rows.length - 1;
						return [
							<dt
								key={`${row.key}-k`}
								className={
									last
										? "py-2.5 font-mono text-label normal-case tracking-normal text-ink-muted"
										: "border-b border-rule py-2.5 font-mono text-label normal-case tracking-normal text-ink-muted"
								}
							>
								{row.key}
							</dt>,
							<dd
								key={`${row.key}-v`}
								className={
									last ? "m-0 py-2.5" : "m-0 border-b border-rule py-2.5"
								}
							>
								{row.value}
							</dd>,
						];
					})}
				</dl>
			</div>
		</div>
	);
}
