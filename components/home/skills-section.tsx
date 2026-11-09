import { BackgroundTable } from "@/components/home/background-table";
import { SkillsKey } from "@/components/home/skills-key";
import { SkillsTable } from "@/components/home/skills-table";
import { Section } from "@/components/ui/section";
import type { Profile } from "@/lib/profile";

/** §4 Skills & background: reference data is always a table. */
export function SkillsSection({
	skills,
	tableLabel,
}: {
	readonly skills: Profile["skills"];
	/** Scroll region label for both tables (dictionary `tableScroll`). */
	readonly tableLabel: string;
}): React.ReactElement {
	return (
		<Section id="skills" n={4} label={skills.label} heading={skills.heading}>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<SkillsTable table={skills.skillsTable} label={tableLabel} />
					<SkillsKey label={skills.skillsTable.key} />
				</div>
				<BackgroundTable table={skills.backgroundTable} label={tableLabel} />
			</div>
		</Section>
	);
}
