import { Entry } from "@/components/home/entry";
import { Section } from "@/components/ui/section";
import type { Profile } from "@/lib/profile";

/** §2 Experience. */
export function ExperienceSection({
	experience,
}: {
	readonly experience: Profile["experience"];
}): React.ReactElement {
	return (
		<Section
			id="experience"
			n={2}
			label={experience.label}
			heading={experience.heading}
		>
			<div className="flex flex-col">
				{experience.entries.map((entry) => (
					<Entry
						key={`${entry.company}-${entry.period}`}
						entry={entry}
						currentLabel={experience.currentLabel}
					/>
				))}
			</div>
		</Section>
	);
}
