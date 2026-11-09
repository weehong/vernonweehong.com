import { TableBox } from "@/components/ui/table-box";
import type { Profile } from "@/lib/profile";

const headClass = "px-5 py-3 font-mono text-label uppercase text-ink-muted";
const chipBase =
	"rounded-xs px-2 py-0.5 font-mono text-label normal-case tracking-normal";

/** Year · Type · Background · Where. */
export function BackgroundTable({
	table,
	label,
}: {
	readonly table: Profile["skills"]["backgroundTable"];
	/** Scroll region label (dictionary `tableScroll`). */
	readonly label: string;
}): React.ReactElement {
	const [year, type, background, where] = table.columns;
	return (
		<TableBox label={label}>
			<thead>
				<tr className="bg-sunken">
					<th scope="col" className={`w-[180px] ${headClass}`}>
						{year}
					</th>
					<th scope="col" className={headClass}>
						{type}
					</th>
					<th scope="col" className={headClass}>
						{background}
					</th>
					<th scope="col" className={headClass}>
						{where}
					</th>
				</tr>
			</thead>
			<tbody>
				{table.rows.map((row) => (
					<tr key={row.title} className="border-t border-rule">
						<th
							scope="row"
							className="px-5 py-4 align-top font-mono text-meta font-medium tabular-nums text-ink"
						>
							{row.year}
						</th>
						<td className="px-5 py-4 align-top">
							<span
								className={
									row.kind === "award"
										? `${chipBase} bg-marker text-marker-ink`
										: `${chipBase} bg-sunken text-ink-soft`
								}
							>
								{row.type}
							</span>
						</td>
						<td className="px-5 py-4 align-top">
							{"titleUrl" in row ? (
								<a
									href={row.titleUrl}
									rel="noreferrer"
									className="text-ink underline decoration-field-line underline-offset-3 hover:decoration-ink"
								>
									{row.title}
								</a>
							) : (
								row.title
							)}
							{"detail" in row && row.detail}
						</td>
						<td className="px-5 py-4 align-top text-ink-muted">{row.where}</td>
					</tr>
				))}
			</tbody>
		</TableBox>
	);
}
