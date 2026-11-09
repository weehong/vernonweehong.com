import { ResumeRow } from "@/components/resume/resume-row";
import { ResumeSection } from "@/components/resume/resume-section";
import { RichText } from "@/components/ui/highlight";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill, formatMonth, type Locale } from "@/lib/i18n/locales";
import type { Resume } from "@/lib/resume";

/**
 * The resume's sections, one component each so the page only lists them
 * (docs/design/components.md, Resume components).
 */

type SectionProps = {
	readonly resume: Resume;
	readonly dictionary: Dictionary;
};

const nameClass = "block font-sans text-body-sm font-semibold text-ink";
const detailClass = "text-body-sm text-ink-soft";

export function ResumeSummary({
	resume,
	dictionary,
}: SectionProps): React.ReactElement {
	return (
		<ResumeSection title={dictionary.resume.summary}>
			<p className="max-w-measure text-body-sm text-ink">{resume.summary}</p>
		</ResumeSection>
	);
}

export function ResumeSkills({
	resume,
	dictionary,
	locale,
}: SectionProps & { readonly locale: Locale }): React.ReactElement {
	return (
		<ResumeSection title={dictionary.resume.skills}>
			{resume.skills.map((skill) => (
				<ResumeRow
					key={skill.group}
					meta={
						<span className="block font-sans text-body-sm font-medium text-ink">
							{skill.group}
						</span>
					}
				>
					<p className={detailClass}>
						{skill.items.join(locale === "zh" ? "、" : ", ")}
					</p>
				</ResumeRow>
			))}
		</ResumeSection>
	);
}

export function ResumeExperience({
	resume,
	dictionary,
	locale,
}: SectionProps & { readonly locale: Locale }): React.ReactElement {
	const month = (value: string): string =>
		formatMonth(locale, value, dictionary.resume.month);
	return (
		<ResumeSection title={dictionary.resume.experience}>
			{resume.experience.map((job) => (
				<ResumeRow
					key={`${job.company}-${job.start}`}
					meta={
						<>
							<span className={nameClass}>{job.role}</span>
							<span className="block text-ink-soft">{job.company}</span>
							<span className="block text-ink-muted">
								<time dateTime={job.start}>{month(job.start)}</time> –{" "}
								{job.end === null ? (
									dictionary.resume.present
								) : (
									<time dateTime={job.end}>{month(job.end)}</time>
								)}
							</span>
						</>
					}
				>
					<ul className="m-0 flex list-disc flex-col gap-2 pl-4.5 text-body-sm text-ink-soft marker:text-ink-muted">
						{job.highlights.map((highlight) => (
							<li key={highlight}>
								<RichText text={highlight} />
							</li>
						))}
					</ul>
				</ResumeRow>
			))}
		</ResumeSection>
	);
}

export function ResumeProjects({
	resume,
	dictionary,
}: SectionProps): React.ReactElement {
	return (
		<ResumeSection title={dictionary.resume.projects}>
			{resume.projects.map((project) => (
				<ResumeRow
					key={project.name}
					meta={
						<>
							<span className={nameClass}>{project.name}</span>
							{"status" in project && project.status && (
								<span className="block text-ink-muted">({project.status})</span>
							)}
						</>
					}
				>
					<p className={detailClass}>{project.description}</p>
				</ResumeRow>
			))}
		</ResumeSection>
	);
}

const lineClass = "flex flex-wrap justify-between gap-x-6";
const periodClass = "font-mono text-meta tabular-nums text-ink-muted";

export function ResumeAwards({
	resume,
	dictionary,
}: SectionProps): React.ReactElement {
	return (
		<ResumeSection title={dictionary.resume.awards}>
			{resume.awards.map((award) => (
				<div key={award.title} className={lineClass}>
					<a
						href={award.url}
						rel="noreferrer"
						className="text-body-sm text-ink underline decoration-field-line underline-offset-3"
					>
						{award.title}
					</a>
					<span className={periodClass}>{award.year}</span>
				</div>
			))}
		</ResumeSection>
	);
}

export function ResumeEducation({
	resume,
	dictionary,
}: SectionProps): React.ReactElement {
	return (
		<ResumeSection title={dictionary.resume.education}>
			{resume.education.map((entry) => (
				<div key={entry.school} className={lineClass}>
					<div className="flex flex-col">
						<span className={nameClass}>{entry.school}</span>
						<span className={detailClass}>{entry.credential}</span>
					</div>
					<span className={periodClass}>{entry.period}</span>
				</div>
			))}
		</ResumeSection>
	);
}

export function ResumeUpdated({
	date,
	dictionary,
}: {
	readonly date: string;
	readonly dictionary: Dictionary;
}): React.ReactElement {
	return (
		<p className="font-mono text-label normal-case tracking-normal text-ink-muted print:hidden">
			{fill(dictionary.resume.updated, { date })}
		</p>
	);
}
