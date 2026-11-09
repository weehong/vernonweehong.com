import { SkillChip } from "@/components/ui/chips";
import { TableBox } from "@/components/ui/table-box";
import type { Profile } from "@/lib/profile";

const headClass = "px-5 py-3 font-mono text-label uppercase text-ink-muted";

/** Skill area · Tools. Daily drivers use the dark chip. */
export function SkillsTable({
	table,
	label,
}: {
	readonly table: Profile["skills"]["skillsTable"];
	/** Scroll region label (dictionary `tableScroll`). */
	readonly label: string;
}): React.ReactElement {
	const [areaColumn, toolsColumn] = table.columns;
	return (
		<TableBox label={label}>
			<thead>
				<tr className="bg-sunken">
					<th scope="col" className={`w-[180px] ${headClass}`}>
						{areaColumn}
					</th>
					<th scope="col" className={headClass}>
						{toolsColumn}
					</th>
				</tr>
			</thead>
			<tbody>
				{table.rows.map((row) => (
					<tr key={row.area} className="border-t border-rule">
						<th
							scope="row"
							className="px-5 py-4 align-top font-mono text-meta font-medium text-ink"
						>
							{row.area}
						</th>
						<td className="px-5 py-3">
							<div className="flex flex-wrap gap-2">
								{row.tools.map((tool) => (
									<SkillChip
										key={tool}
										daily={(row.dailyDrivers as ReadonlyArray<string>).includes(
											tool
										)}
									>
										{tool}
									</SkillChip>
								))}
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</TableBox>
	);
}
