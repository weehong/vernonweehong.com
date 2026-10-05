import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PrintButton } from "@/components/portfolio-interactions";
import { pageMetadata } from "@/lib/metadata";
import { awards, education, skills, socialLinks } from "@/lib/profile";
import {
	formatMonth,
	resumeEmail,
	resumeExperience,
	resumeProjects,
} from "@/lib/resume";
import { siteConfig } from "@/lib/site-config";
import { buildGraph, getResumeNodes } from "@/lib/structured-data";

const description =
	"Resume of Vernon Koh (Vernon Wee Hong KOH), backend engineer in Singapore — Java/Spring Boot at DBS Bank, projects, skills and education.";

export const metadata: Metadata = pageMetadata({
	title: "Resume",
	description,
	path: "/resume",
});

const lastUpdated = new Intl.DateTimeFormat("en-SG", {
	dateStyle: "long",
}).format(new Date(siteConfig.lastModified));

/** "https://www.github.com/weehong/" -> "github.com/weehong" */
function displayUrl(href: string): string {
	return href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

// Section order and two-column layout follow the PDF resume: the role,
// project or skill group in a fixed left column, details on the right.
export default function ResumePage(): React.ReactElement {
	return (
		<div className="resume-shell">
			<JsonLd data={buildGraph(...getResumeNodes(description))} />
			<nav className="resume-toolbar" aria-label="Resume actions">
				<Link href="/" className="button button-ghost">
					← Back to portfolio
				</Link>
				<PrintButton documentTitle={`${siteConfig.siteName} - Resume`} />
			</nav>

			<main className="resume">
				<header className="resume-header">
					<p className="eyebrow resume-eyebrow">Resume</p>
					<h1>
						Vernon Wee Hong <span>KOH</span>
					</h1>
					<p className="resume-role">
						{siteConfig.jobTitle} · {siteConfig.location}
					</p>
					<ul className="resume-links">
						<li>
							<a href={`mailto:${resumeEmail}`}>{resumeEmail}</a>
						</li>
						{/* On paper the reader can't click through, so print the site too. */}
						<li className="print-only">
							<a href={siteConfig.url}>{displayUrl(siteConfig.url)}</a>
						</li>
						{socialLinks.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									aria-label={link.label}
									target="_blank"
									rel="me noreferrer"
								>
									{displayUrl(link.href)}
								</a>
							</li>
						))}
					</ul>
				</header>

				<section aria-labelledby="resume-skills">
					<h2 id="resume-skills">Skills</h2>
					<dl className="resume-rows">
						{skills.map((group) => (
							<div className="resume-row" key={group.title}>
								<dt>{group.title}</dt>
								<dd>{group.items.join(", ")}</dd>
							</div>
						))}
					</dl>
				</section>

				<section aria-labelledby="resume-experience">
					<h2 id="resume-experience">Experience</h2>
					{resumeExperience.map((job) => (
						<article
							className="resume-row resume-entry"
							key={`${job.company}-${job.start}`}
						>
							<header className="resume-meta">
								<h3>{job.role}</h3>
								<p className="resume-company">{job.company}</p>
								<p className="resume-dates">
									<time dateTime={job.start}>{formatMonth(job.start)}</time> –{" "}
									{job.end === null ? (
										"Present"
									) : (
										<time dateTime={job.end}>{formatMonth(job.end)}</time>
									)}
								</p>
							</header>
							<ul className="resume-highlights">
								{job.highlights.map((highlight) => (
									<li key={highlight}>{highlight}</li>
								))}
							</ul>
						</article>
					))}
				</section>

				<section aria-labelledby="resume-projects">
					<h2 id="resume-projects">Projects</h2>
					{resumeProjects.map((project) => (
						<article className="resume-row resume-entry" key={project.name}>
							<header className="resume-meta">
								<h3>{project.name}</h3>
							</header>
							<p>{project.description}</p>
						</article>
					))}
				</section>

				<section aria-labelledby="resume-awards">
					<h2 id="resume-awards">Awards</h2>
					{awards.map((award) => (
						<div className="resume-split resume-entry" key={award.title}>
							<a href={award.url} target="_blank" rel="noreferrer">
								{award.title}
							</a>
							<p className="resume-dates">{award.year}</p>
						</div>
					))}
				</section>

				<section aria-labelledby="resume-education">
					<h2 id="resume-education">Education</h2>
					{education.map((entry) => (
						<article className="resume-split resume-entry" key={entry.school}>
							<div>
								<h3>
									{entry.school}, {entry.location}
								</h3>
								<p>{entry.credential}</p>
							</div>
							<p className="resume-dates">{entry.period}</p>
						</article>
					))}
				</section>

				<p className="resume-updated">
					Last updated{" "}
					<time dateTime={siteConfig.lastModified}>{lastUpdated}</time>
				</p>
			</main>
		</div>
	);
}
