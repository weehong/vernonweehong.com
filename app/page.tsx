import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import {
	ContactForm,
	PortfolioEffects,
	ThemeToggle,
} from "@/components/portfolio-interactions";
import { pageMetadata } from "@/lib/metadata";
import {
	awards,
	education,
	experience,
	featuredProject,
	formatPeriod,
	otherProjects,
	skills,
	socialLinks,
} from "@/lib/profile";
import { siteConfig } from "@/lib/site-config";
import { buildGraph, getProfilePageNode } from "@/lib/structured-data";

const navigation = ["about", "experience", "projects", "skills", "background"];

export const metadata: Metadata = pageMetadata({
	title: { absolute: siteConfig.title },
	path: "/",
	ogType: "profile",
});

function SectionHeading({
	eyebrow,
	children,
}: Readonly<{
	eyebrow: string;
	children: React.ReactNode;
}>): React.ReactElement {
	return (
		<header className="section-heading">
			<p className="eyebrow">{eyebrow}</p>
			<h2>{children}</h2>
		</header>
	);
}

function Tags({
	items,
}: Readonly<{ items: ReadonlyArray<string> }>): React.ReactElement {
	return (
		<div className="tags">
			{items.map((item) => (
				<span key={item}>{item}</span>
			))}
		</div>
	);
}

function SocialLinks(): React.ReactElement {
	return (
		<div className="social-links">
			{socialLinks.map((link) => (
				<a
					key={link.href}
					href={link.href}
					aria-label={link.label}
					target="_blank"
					rel="me noreferrer"
				>
					{link.short}
				</a>
			))}
		</div>
	);
}

export default function Home(): React.ReactElement {
	return (
		<>
			<JsonLd data={buildGraph(getProfilePageNode())} />
			<PortfolioEffects />
			<div className="portfolio-shell">
				<div className="ambient ambient-mist" data-blob />
				<div className="ambient ambient-red" data-blob />
				<div className="portfolio-grid">
					<aside className="profile-rail">
						<div className="rail-topline">
							<div className="availability">
								<span className="status-dot" aria-hidden="true">
									<span />
								</span>
								<span>Available for work</span>
							</div>
							<ThemeToggle />
						</div>
						<div className="identity">
							<h1 aria-label="Vernon Wee Hong KOH">
								Vernon <br />
								Wee Hong <br />
								<span>KOH</span>
							</h1>
							<p className="role">Backend Engineer</p>
							<p className="intro">
								I architect and ship production REST services and
								regulated-market API platforms for APAC banking.
							</p>
						</div>
						<p className="stack-line">
							DBS Bank · Java, Spring Boot, TypeScript · Singapore
						</p>
						<div className="rail-actions">
							<a className="button button-primary" href="#contact">
								Get in touch
							</a>
							<Link className="button button-ghost" href="/resume">
								Resume
							</Link>
						</div>
						<nav className="section-nav" aria-label="Portfolio sections">
							{navigation.map((item, index) => (
								<a
									href={`#${item}`}
									data-spy={item}
									data-active={index === 0 ? "true" : "false"}
									key={item}
								>
									<span aria-hidden="true" />
									{item}
								</a>
							))}
						</nav>
						<SocialLinks />
					</aside>

					<main className="portfolio-main">
						<section id="about" data-reveal>
							<p className="eyebrow">About</p>
							<h2>
								Production first, <span className="brand-text">contracts</span>{" "}
								that hold
							</h2>
							<p className="lead">
								I&apos;m Vernon Koh, a Singapore-based backend engineer. I
								architect and ship production REST services, integration
								workflows and regulated-market API platforms in APAC banking.
							</p>
							<p>
								I own backend work end to end - requirements, service design,
								implementation, testing, rollout and production hardening -
								partnering with engineering teams and stakeholders across
								Singapore, India and Taiwan to deliver stable contracts and
								measurable outcomes.
							</p>
							<p>
								AI coding agents are part of that loop now. I lean on them for
								scaffolding, test generation and large refactor passes, and I
								review every line that reaches a pull request. The API contract,
								the failure modes and the observability stay mine to own.
							</p>
							<p>
								Maintainable architecture, clear API boundaries and operational
								discipline - so teams ship fast without trading away
								reliability.
							</p>
							<div className="now-card">
								<span>Now</span>
								<p>
									Building reliable backend systems with Java/Spring Boot,
									TypeScript and production-grade API integrations.
								</p>
							</div>
						</section>

						<section id="experience" data-reveal>
							<SectionHeading eyebrow="Experience">
								Ten years shipping backends
							</SectionHeading>
							<div className="card-stack" data-card-stack data-stagger>
								{experience.map((job, index) => (
									<article
										className="card experience-card"
										style={{ "--stack-i": index } as React.CSSProperties}
										key={`${job.company}-${String(job.startYear)}`}
									>
										<p className="period">{formatPeriod(job)}</p>
										<h3>
											{job.role} <span>· {job.company}</span>
										</h3>
										{job.achievements.map((achievement) => (
											<p key={achievement}>{achievement}</p>
										))}
										<Tags items={job.tags} />
									</article>
								))}
								<div className="stack-spacer" aria-hidden="true" />
							</div>
						</section>

						<section id="projects" data-card-stack data-reveal>
							<SectionHeading eyebrow="Selected work">
								Platforms I own outright
							</SectionHeading>
							<article
								className="card feature-card"
								style={{ "--stack-i": 0 } as React.CSSProperties}
							>
								{/* Decorative placeholder until real app screenshots exist. */}
								<div
									className="project-media"
									data-parallax-frame
									aria-hidden="true"
								>
									<div data-parallax-img>
										<span>{featuredProject.name} app screens</span>
									</div>
								</div>
								<div className="project-copy">
									<div className="project-title">
										<h3>{featuredProject.name}</h3>
										{featuredProject.label ? (
											<span>{featuredProject.label}</span>
										) : null}
									</div>
									<p>{featuredProject.description}</p>
									<Tags items={featuredProject.tags} />
								</div>
							</article>
							{otherProjects.map((project, index) => (
								<article
									className="card project-card"
									style={{ "--stack-i": index + 1 } as React.CSSProperties}
									key={project.name}
								>
									<h3>{project.name}</h3>
									<p>{project.description}</p>
									<Tags items={project.tags} />
								</article>
							))}
							<div className="stack-spacer" aria-hidden="true" />
						</section>

						<section id="skills" data-reveal>
							<SectionHeading eyebrow="Skills">
								What I build with
							</SectionHeading>
							<div className="skills-grid" data-stagger>
								{skills.map((group) => (
									<div className="skill-group" key={group.title}>
										<h3>{group.title}</h3>
										<Tags items={group.items} />
									</div>
								))}
							</div>
						</section>

						<section id="background" data-reveal>
							<SectionHeading eyebrow="Background">
								Recognition and education
							</SectionHeading>
							<div className="background-list" data-stagger>
								<div>
									<h3>Awards</h3>
									{awards.map((award) => (
										<div className="award" key={award.title}>
											<span>{award.year}</span>
											<a href={award.url} target="_blank" rel="noreferrer">
												{award.title}
											</a>
										</div>
									))}
								</div>
								<hr />
								<div>
									<h3>Education</h3>
									<div className="education-grid">
										{education.map((entry) => (
											<div key={entry.school}>
												<span>{entry.period}</span>
												<strong>{entry.school}</strong>
												<p>
													{entry.credential} · {entry.location}
												</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</section>

						<section id="contact" className="contact-section" data-reveal>
							<header>
								<p className="eyebrow">Contact</p>
								<h2>Let&apos;s talk backends</h2>
								<p>
									Open to backend and platform roles, and to API work that has
									to hold up in production. I reply to everything.
								</p>
							</header>
							<div className="contact-grid">
								<ContactForm />
								<address>
									<div>
										<span>Based in</span>
										<p>Singapore · GMT+8</p>
									</div>
								</address>
							</div>
						</section>
					</main>
				</div>
			</div>
			<footer className="site-footer">
				<div>
					<div>
						<strong>Vernon Wee Hong KOH</strong>
						<span>Backend engineer, Singapore</span>
					</div>
					<SocialLinks />
					<span>© 2026 Vernon Wee Hong KOH</span>
				</div>
			</footer>
		</>
	);
}
