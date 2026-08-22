import type { Metadata } from "next";
import {
	ContactForm,
	PortfolioEffects,
	ThemeToggle,
} from "@/components/portfolio-interactions";
import { siteConfig } from "@/lib/site-config";

const navigation = ["about", "experience", "projects", "skills", "background"];

const socialLinks = [
	{ label: "GitHub", short: "GH", href: "https://github.com/weehong" },
	{
		label: "LinkedIn",
		short: "IN",
		href: "https://www.linkedin.com/in/weehongkoh/",
	},
	{
		label: "YouTube",
		short: "YT",
		href: "https://www.youtube.com/@weehongayden90",
	},
];

const experience = [
	{
		period: "2020 - CURRENT · SINGAPORE",
		role: "Full-Stack Software Engineer",
		company: "DBS Bank",
		achievements: [
			"Architected the YFJ platform APIs for India and Taiwan, retiring one-off regional integrations in favour of reusable Java/Spring Boot services with versioned contracts and market-specific auth and access control for a dual-market rollout.",
			"Modernized reporting services to cut APAC setup effort by 30% and compress financial-document turnaround from hours to seconds, delivering one-click localized report APIs and folding Kofax digital-signature flows into automated pipelines.",
			"Engineered production-grade backend integrations for staff-assisted product journeys, wiring internal banking REST APIs into existing session and control patterns, then hardening delivery with automated regression, peer review and phased rollout inside a regulated environment.",
			"Standardized service-consumption patterns now adopted by 5+ teams, cutting duplicated implementation across squads.",
		],
		tags: [
			"Java",
			"Spring Boot",
			"TypeScript",
			"REST",
			"API Design",
			"Access Control",
			"Jaspersoft",
			"Cloudflare",
		],
	},
	{
		period: "2018 - 2020 · SINGAPORE",
		role: "Fullstack Developer",
		company: "IPI Singapore",
		achievements: [
			"Accelerated operational responsiveness by 60% with a Go batch-processing backend that eliminated manual routing entirely, exposing explicit REST integration points so downstream teams could consume routed workloads reliably.",
			"Built and operated the backend behind project tracking and invoicing, replacing fragmented email and spreadsheet coordination with a single system of record for status and billing.",
			"Owned automation delivery from discovery to production handover - maintainable services and durable integration flows, not one-off scripts.",
		],
		tags: ["Golang", "REST", "Automation", "Backend Services"],
	},
	{
		period: "2017 - 2018 · SINGAPORE",
		role: "Fullstack Developer",
		company: "Blissbox",
		achievements: [
			"Architected and launched a Laravel commerce backend on Google Cloud with Stripe payment processing and MySQL persistence, transacting reliably from go-live.",
			"Delivered in 3 months and sustained 99.9% uptime while fully digitizing the client's sales and payment path.",
			"Set roadmap priorities directly with business owners across feature delivery, payment flows and uptime targets.",
		],
		tags: ["Laravel", "MySQL", "Google Cloud", "Stripe"],
	},
	{
		period: "2015 - 2017 · SINGAPORE",
		role: "Web Developer",
		company: "WizWerx",
		achievements: [
			"Delivered PHP-backed web solutions aligned to client branding and conversion goals, with maintainable templates and production-ready content pipelines.",
			"Scoped and executed projects from requirements through go-live, shipping dependable SEO-oriented pages on timeline and improving delivery predictability for SME clients.",
		],
		tags: ["PHP", "WordPress", "SEO"],
	},
];

const skills = [
	{
		title: "Programming Language",
		items: ["Java", "TypeScript", "Golang", "C#", "Kotlin", "Swift"],
	},
	{
		title: "Framework and Library",
		items: [
			"Spring Boot",
			".NET Core",
			"Laravel",
			"Node.js",
			"ReactJs",
			"NextJs",
		],
	},
	{
		title: "Database and Storage",
		items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "OpenSearch", "S3"],
	},
	{
		title: "Tool and Service",
		items: [
			"Docker",
			"Jenkins",
			"SonarQube",
			"CloudWatch",
			"Cloudflare",
			"Google Cloud",
		],
	},
];

export const metadata: Metadata = {
	title: { absolute: siteConfig.name },
	description: siteConfig.description,
	alternates: { canonical: "/" },
	openGraph: {
		title: siteConfig.name,
		description: siteConfig.description,
		url: "/",
	},
};

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
					rel="noreferrer"
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
								Vernon
								<br />
								Wee Hong
								<br />
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
							<a className="button button-ghost" href="#contact">
								Resume
							</a>
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
								Singapore-based backend engineer. I architect and ship
								production REST services, integration workflows and
								regulated-market API platforms in APAC banking.
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
										key={`${job.company}-${job.period}`}
									>
										<p className="period">{job.period}</p>
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
								<div className="project-media" data-parallax-frame>
									<div data-parallax-img>
										<span>Upmatches app screens</span>
									</div>
								</div>
								<div className="project-copy">
									<div className="project-title">
										<h3>Upmatches</h3>
										<span>Solo build</span>
									</div>
									<p>
										Sole backend owner. Architected and maintain the shared REST
										APIs powering web, Android and iOS clients for
										Singapore&apos;s badminton scene - service design through
										deployment, testing and production maintenance on one
										platform, with stable endpoints for game discovery,
										scheduling and organizer attendance workflows.
									</p>
									<Tags
										items={[
											"REST API",
											"Service Design",
											"API Contracts",
											"Data Modeling",
										]}
									/>
								</div>
							</article>
							<article
								className="card project-card"
								style={{ "--stack-i": 1 } as React.CSSProperties}
							>
								<h3>Full-Text Search for PDFs on AWS</h3>
								<p>
									Production PDF full-text search backend in C# .NET Web API
									using CQRS and Onion Architecture. Orchestrated document
									extraction through SQS/SNS, persisted assets in S3 with
									presigned URLs, and served fuzzy and faceted queries via
									OpenSearch - with Cognito-backed auth, resilient retry workers
									and CloudWatch observability holding it steady.
								</p>
								<Tags
									items={[
										"C# .NET",
										"CQRS",
										"Textract",
										"OpenSearch",
										"Cognito",
										"CloudWatch",
									]}
								/>
							</article>
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
									<div className="award">
										<span>2019</span>
										<a
											href="https://www.dbs.com/NewsPrinter.page?newsId=k0u62hn2&locale=en"
											target="_blank"
											rel="noreferrer"
										>
											DBS Recognition for Outstanding Performance, DBS Paradigm
											Shift Global Hackathon (Team 1206)
										</a>
									</div>
								</div>
								<hr />
								<div>
									<h3>Education</h3>
									<div className="education-grid">
										<div>
											<span>2012 - 2014</span>
											<strong>Campbell University</strong>
											<p>B.S. in Information Technology · North Carolina</p>
										</div>
										<div>
											<span>2012 - 2014</span>
											<strong>Tunku Abdul Rahman University College</strong>
											<p>
												Advanced Diploma in Internet Technology cum BS Degree ·
												Malaysia
											</p>
										</div>
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
