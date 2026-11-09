import {
	ProjectMedia,
	type ProjectMediaData,
} from "@/components/home/project-media";
import { StatusChip, TagRow } from "@/components/ui/chips";
import { diagramBoxes, type Profile } from "@/lib/profile";

type Project = Profile["projects"]["items"][number];

function mediaOf(project: Project): ProjectMediaData {
	const media = project.media;
	if (media.kind === "diagram" && media.rows && media.ariaLabel) {
		return {
			kind: "diagram",
			ariaLabel: media.ariaLabel,
			rows: media.rows.map((row) => diagramBoxes(row)),
		};
	}
	return { kind: "phones-placeholder", captions: media.captions ?? [] };
}

/** Media left, text right. Every project card uses this layout. */
export function ProjectCard({
	project,
}: {
	readonly project: Project;
}): React.ReactElement {
	return (
		<article className="flex flex-wrap overflow-hidden rounded-md border border-rule bg-raised">
			<ProjectMedia media={mediaOf(project)} />
			<div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 p-7">
				<div className="flex flex-wrap items-center gap-3">
					<h3 className="font-display text-title">{project.name}</h3>
					{"label" in project && (
						<StatusChip tone="night">{project.label}</StatusChip>
					)}
				</div>
				<p className="text-body text-ink-soft">{project.description}</p>
				<TagRow tags={project.tags} />
			</div>
		</article>
	);
}
