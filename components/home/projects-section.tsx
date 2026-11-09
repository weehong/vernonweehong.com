import { ProjectCard } from "@/components/home/project-card";
import { Section } from "@/components/ui/section";
import type { Profile } from "@/lib/profile";

/** §3 Projects. */
export function ProjectsSection({
	projects,
}: {
	readonly projects: Profile["projects"];
}): React.ReactElement {
	return (
		<Section
			id="projects"
			n={3}
			label={projects.label}
			heading={projects.heading}
		>
			<div className="flex flex-col gap-6">
				{projects.items.map((project) => (
					<ProjectCard key={project.name} project={project} />
				))}
			</div>
		</Section>
	);
}
