/**
 * Resume-only content for /resume, transcribed from the resume PDF generator
 * (projects/resume, src/data/resume-backend.ts). Facts shared with the
 * homepage (skills, education, awards, social links) stay in `lib/profile.ts`.
 */

/** Shown on /resume only; the homepage deliberately has no email address. */
export const resumeEmail = "vernonweehongkoh@gmail.com";

export type ResumeExperience = {
	readonly role: string;
	readonly company: string;
	/** "YYYY-MM" */
	readonly start: string;
	/** "YYYY-MM", or `null` while the role is current. */
	readonly end: string | null;
	readonly highlights: ReadonlyArray<string>;
};

export type ResumeProject = {
	readonly name: string;
	readonly description: string;
};

export const resumeExperience: ReadonlyArray<ResumeExperience> = [
	{
		role: "Software Engineer",
		company: "DBS Bank",
		start: "2020-04",
		end: null,
		highlights: [
			"Engineered and shipped production-grade backend integrations for staff-assisted product journeys by connecting internal banking REST APIs to existing session and control patterns, then hardening delivery through automated regression, peer review, and phased rollout in a regulated environment.",
			"Architected YFJ platform APIs for India and Taiwan, replacing one-off regional integrations with reusable backend services by designing Java/Spring Boot REST layers, versioned integration contracts, and market-specific auth and access controls for dual-market rollout.",
			"Modernized reporting backend services to reduce APAC setup effort by 30% and compress financial-document turnaround from hours to seconds by delivering one-click localized report APIs and integrating Kofax digital-signature flows into automated pipelines.",
			"Standardized service-consumption patterns with shared front-end platform work adopted by 5+ teams, improving consistency of API usage and reducing duplicated implementation across squads.",
		],
	},
	{
		role: "Full-stack Developer",
		company: "IPI Singapore",
		start: "2018-05",
		end: "2020-04",
		highlights: [
			"Accelerated operational responsiveness by 60% through a Go batch-processing backend that eliminated manual routing, with explicit REST integration points so downstream teams could consume routed workloads reliably.",
			"Built and operated backend services supporting project tracking and invoicing workflows, replacing fragmented email and spreadsheet coordination with a centralized system of record for status and billing.",
			"Owned automation delivery from discovery to production handover, translating stakeholder requirements into maintainable services and durable integration flows instead of one-off scripts.",
		],
	},
	{
		role: "Full-stack Developer",
		company: "Blissbox Pte. Ltd.",
		start: "2017-07",
		end: "2018-04",
		highlights: [
			"Architected and launched a Laravel-based commerce backend on Google Cloud with Stripe payment processing and MySQL persistence, enabling reliable day-to-day transaction operations from go-live.",
			"Delivered the platform in 3 months and sustained 99.9% uptime while fully digitizing the client’s sales and payment path.",
			"Prioritized roadmap execution with business owners across feature delivery, payment flows, and uptime targets to keep launch scope aligned with revenue outcomes and operational support capacity.",
		],
	},
	{
		role: "Web Developer",
		company: "WizWerx Pte. Ltd.",
		start: "2015-09",
		end: "2017-07",
		highlights: [
			"Delivered PHP-backed web solutions aligned to client branding and conversion goals, with maintainable templates and production-ready content pipelines.",
			"Released launch-ready implementations and supporting assets on timeline, improving delivery predictability for SME clients.",
			"Scoped and executed projects from requirement gathering through go-live with dependable, SEO-oriented pages and stable deployment outcomes.",
		],
	},
];

export const resumeProjects: ReadonlyArray<ResumeProject> = [
	{
		name: "Upmatches",
		description:
			"Solo product—backend ownership. Architected and maintain shared REST APIs powering web, Android, and iOS clients for Upmatches (Singapore badminton). Own service design through deployment, testing, and production maintenance on one backend platform. Built stable endpoints for game discovery, scheduling, and organizer attendance workflows.",
	},
	{
		name: "Full-Text Search for PDFs with AWS",
		description:
			"Built production PDF full-text search backend on AWS with C# .NET Web API using CQRS and Onion Architecture. Orchestrated document extraction through SQS/SNS, persisted assets in S3 with presigned URLs, and served fuzzy and faceted queries with OpenSearch. Implemented Cognito-backed auth, resilient retry workers, and CloudWatch observability for stable operations.",
	},
];

// Fixed names rather than Intl, whose short months vary by ICU version
// (e.g. "Sep" vs "Sept").
const monthNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
] as const;

/** "2020-04" -> "Apr 2020" */
export function formatMonth(yearMonth: string): string {
	const [year = "", month = ""] = yearMonth.split("-");
	return `${monthNames[Number(month) - 1] ?? ""} ${year}`;
}
