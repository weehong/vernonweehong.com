/**
 * Portfolio content shared by the homepage, the /resume page and the
 * structured data, so the three never drift apart.
 */

export type SocialLink = {
	readonly label: string;
	readonly short: string;
	readonly href: string;
};

export type Experience = {
	readonly role: string;
	readonly company: string;
	readonly companyUrl?: string;
	readonly startYear: number;
	/** `null` while the role is current. */
	readonly endYear: number | null;
	readonly location: string;
	readonly achievements: ReadonlyArray<string>;
	readonly tags: ReadonlyArray<string>;
};

export type Project = {
	readonly name: string;
	/** Short label shown next to the title, e.g. "Solo build". */
	readonly label?: string;
	readonly description: string;
	readonly tags: ReadonlyArray<string>;
};

export type SkillGroup = {
	readonly title: string;
	readonly items: ReadonlyArray<string>;
};

export type Education = {
	readonly period: string;
	readonly school: string;
	readonly credential: string;
	readonly location: string;
};

export type Award = {
	readonly year: number;
	readonly title: string;
	readonly url: string;
};

export const socialLinks: ReadonlyArray<SocialLink> = [
	{ label: "GitHub", short: "GH", href: "https://github.com/weehong" },
	{
		label: "LinkedIn",
		short: "IN",
		href: "https://sg.linkedin.com/in/vernonweehong",
	},
];

export const experience: ReadonlyArray<Experience> = [
	{
		role: "Full-Stack Software Engineer",
		company: "DBS Bank",
		companyUrl: "https://www.dbs.com",
		startYear: 2020,
		endYear: null,
		location: "Singapore",
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
		role: "Fullstack Developer",
		company: "IPI Singapore",
		startYear: 2018,
		endYear: 2020,
		location: "Singapore",
		achievements: [
			"Accelerated operational responsiveness by 60% with a Go batch-processing backend that eliminated manual routing entirely, exposing explicit REST integration points so downstream teams could consume routed workloads reliably.",
			"Built and operated the backend behind project tracking and invoicing, replacing fragmented email and spreadsheet coordination with a single system of record for status and billing.",
			"Owned automation delivery from discovery to production handover - maintainable services and durable integration flows, not one-off scripts.",
		],
		tags: ["Golang", "REST", "Automation", "Backend Services"],
	},
	{
		role: "Fullstack Developer",
		company: "Blissbox",
		startYear: 2017,
		endYear: 2018,
		location: "Singapore",
		achievements: [
			"Architected and launched a Laravel commerce backend on Google Cloud with Stripe payment processing and MySQL persistence, transacting reliably from go-live.",
			"Delivered in 3 months and sustained 99.9% uptime while fully digitizing the client's sales and payment path.",
			"Set roadmap priorities directly with business owners across feature delivery, payment flows and uptime targets.",
		],
		tags: ["Laravel", "MySQL", "Google Cloud", "Stripe"],
	},
	{
		role: "Web Developer",
		company: "WizWerx",
		startYear: 2015,
		endYear: 2017,
		location: "Singapore",
		achievements: [
			"Delivered PHP-backed web solutions aligned to client branding and conversion goals, with maintainable templates and production-ready content pipelines.",
			"Scoped and executed projects from requirements through go-live, shipping dependable SEO-oriented pages on timeline and improving delivery predictability for SME clients.",
		],
		tags: ["PHP", "WordPress", "SEO"],
	},
];

/** Shown with a media frame at the top of the homepage projects stack. */
export const featuredProject: Project = {
	name: "Upmatches",
	label: "Solo build",
	description:
		"Sole backend owner. Architected and maintain the shared REST APIs powering web, Android and iOS clients for Singapore's badminton scene - service design through deployment, testing and production maintenance on one platform, with stable endpoints for game discovery, scheduling and organizer attendance workflows.",
	tags: ["REST API", "Service Design", "API Contracts", "Data Modeling"],
};

export const otherProjects: ReadonlyArray<Project> = [
	{
		name: "Full-Text Search for PDFs on AWS",
		description:
			"Production PDF full-text search backend in C# .NET Web API using CQRS and Onion Architecture. Orchestrated document extraction through SQS/SNS, persisted assets in S3 with presigned URLs, and served fuzzy and faceted queries via OpenSearch - with Cognito-backed auth, resilient retry workers and CloudWatch observability holding it steady.",
		tags: [
			"C# .NET",
			"CQRS",
			"Textract",
			"OpenSearch",
			"Cognito",
			"CloudWatch",
		],
	},
];

export const projects: ReadonlyArray<Project> = [
	featuredProject,
	...otherProjects,
];

export const skills: ReadonlyArray<SkillGroup> = [
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

export const education: ReadonlyArray<Education> = [
	{
		period: "2012 – 2014",
		school: "Campbell University",
		credential: "B.S. in Information Technology",
		location: "North Carolina",
	},
	{
		period: "2012 – 2014",
		school: "Tunku Abdul Rahman University College",
		credential: "Advanced Diploma in Internet Technology cum BS Degree",
		location: "Malaysia",
	},
];

export const awards: ReadonlyArray<Award> = [
	{
		year: 2019,
		title:
			"DBS Recognition for Outstanding Performance, DBS Paradigm Shift Global Hackathon (Team 1206)",
		url: "https://www.dbs.com/NewsPrinter.page?newsId=k0u62hn2&locale=en",
	},
];

/** Display period, e.g. "2020 - CURRENT · SINGAPORE". */
export function formatPeriod(job: Experience): string {
	const end = job.endYear === null ? "CURRENT" : String(job.endYear);
	return `${String(job.startYear)} - ${end} · ${job.location.toUpperCase()}`;
}
