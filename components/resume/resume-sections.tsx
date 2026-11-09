import { ResumeRow } from "@/components/resume/resume-row";
import { ResumeSection } from "@/components/resume/resume-section";
import { StatusChip } from "@/components/ui/chips";
import { RichText } from "@/components/ui/highlight";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatMonth, type Locale } from "@/lib/i18n/locales";
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
/** Running text is justified, with hyphenation to keep the gaps even. */
const justifyClass = "text-justify hyphens-auto";
const detailClass = `text-body-sm text-ink-soft ${justifyClass}`;

export function ResumeSummary({
	resume,
	dictionary,
}: SectionProps): React.ReactElement {
	return (
		<ResumeSection n={1} title={dictionary.resume.summary}>
			<p className={`text-body-sm text-ink ${justifyClass}`}>
				{resume.summary}
			</p>
		</ResumeSection>
	);
}

export function ResumeSkills({
	resume,
	dictionary,
	locale,
}: SectionProps & { readonly locale: Locale }): React.ReactElement {
	return (
		<ResumeSection n={2} title={dictionary.resume.skills}>
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
		<ResumeSection n={3} title={dictionary.resume.experience}>
			{/* The timeline: a dot per job, joined by a line (screen only). */}
			<ol className="m-0 flex list-none flex-col gap-8 p-0 print:gap-[6pt]">
				{resume.experience.map((job) => (
					<li
						key={`${job.company}-${job.start}`}
						className="relative pl-8 after:absolute after:top-5 after:-bottom-8 after:left-1.5 after:w-px after:bg-rule last:after:hidden print:pl-0 print:after:hidden"
					>
						<span
							aria-hidden
							className={
								job.end === null
									? "absolute top-1 left-0 size-3 rounded-pill border-2 border-signal bg-signal ring-4 ring-signal-bg print:hidden"
									: "absolute top-1 left-0 size-3 rounded-pill border-2 border-ink-muted bg-raised print:hidden"
							}
						/>
						<ResumeRow
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
									{job.end === null && (
										<span className="mt-2 block print:hidden">
											<StatusChip>{dictionary.current}</StatusChip>
										</span>
									)}
								</>
							}
						>
							<ul
								className={`m-0 flex list-disc flex-col gap-2 pl-4.5 text-body-sm text-ink-soft marker:text-ink-muted ${justifyClass}`}
							>
								{job.highlights.map((highlight) => (
									<li key={highlight}>
										<RichText text={highlight} />
									</li>
								))}
							</ul>
						</ResumeRow>
					</li>
				))}
			</ol>
		</ResumeSection>
	);
}

export function ResumeProjects({
	resume,
	dictionary,
}: SectionProps): React.ReactElement {
	return (
		<ResumeSection n={4} title={dictionary.resume.projects}>
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
		<ResumeSection n={5} title={dictionary.resume.awards}>
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
		<ResumeSection n={6} title={dictionary.resume.education}>
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

/** "Last updated" stamp at the top of the resume, so readers see how fresh it is. */
export function ResumeUpdated({
	date,
	dateTime,
	dictionary,
}: {
	readonly date: string;
	readonly dateTime: string;
	readonly dictionary: Dictionary;
}): React.ReactElement {
	const [before = "", after = ""] = dictionary.resume.updated.split("{date}");
	return (
		<p className="inline-flex items-center gap-2 rounded-xs border border-rule bg-sunken px-2.5 py-1 font-mono text-label normal-case tracking-normal text-ink-soft">
			<span aria-hidden className="size-2 rounded-pill bg-signal" />
			<span>
				{before}
				<time dateTime={dateTime} className="text-ink">
					{date}
				</time>
				{after}
			</span>
		</p>
	);
}
