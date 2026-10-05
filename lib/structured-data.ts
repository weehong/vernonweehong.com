import type {
	BreadcrumbList,
	Graph,
	Person,
	ProfilePage,
	Thing,
	WebPage,
	WebSite,
} from "schema-dts";
import {
	awards,
	education,
	experience,
	skills,
	socialLinks,
} from "@/lib/profile";
import { siteConfig } from "@/lib/site-config";

// Stable node identifiers so every page's graph links the same entities.
export const websiteId = `${siteConfig.url}/#website`;
export const personId = `${siteConfig.url}/#person`;

const resumeUrl = `${siteConfig.url}/resume`;

/** The site itself; `name` and `alternateName` feed Google's site names. */
export function getWebSiteNode(): WebSite {
	return {
		"@type": "WebSite",
		"@id": websiteId,
		url: siteConfig.url,
		name: siteConfig.siteName,
		alternateName: [...siteConfig.alternateNames],
		description: siteConfig.description,
		inLanguage: siteConfig.language,
		publisher: { "@id": personId },
	};
}

/** The portfolio owner. */
export function getPersonNode(): Person {
	const currentJob = experience.find((job) => job.endYear === null);

	return {
		"@type": "Person",
		"@id": personId,
		name: siteConfig.author,
		alternateName: [...siteConfig.alternateNames],
		givenName: siteConfig.givenName,
		additionalName: siteConfig.additionalName,
		familyName: siteConfig.familyName,
		jobTitle: siteConfig.jobTitle,
		description: siteConfig.description,
		url: siteConfig.url,
		...(siteConfig.image
			? { image: new URL(siteConfig.image, siteConfig.url).href }
			: {}),
		sameAs: socialLinks.map((link) => link.href),
		homeLocation: {
			"@type": "Place",
			name: siteConfig.location,
			address: { "@type": "PostalAddress", addressCountry: "SG" },
		},
		...(currentJob
			? {
					worksFor: {
						"@type": "Organization",
						name: currentJob.company,
						...(currentJob.companyUrl ? { url: currentJob.companyUrl } : {}),
					},
				}
			: {}),
		alumniOf: education.map((entry) => ({
			"@type": "CollegeOrUniversity",
			name: entry.school,
		})),
		knowsAbout: skills.flatMap((group) => group.items),
		award: awards.map((award) => `${award.title} (${String(award.year)})`),
	};
}

/** Homepage: a profile page whose main entity is the owner. */
export function getProfilePageNode(): ProfilePage {
	return {
		"@type": "ProfilePage",
		"@id": `${siteConfig.url}/#profilepage`,
		url: siteConfig.url,
		name: siteConfig.title,
		inLanguage: siteConfig.language,
		dateModified: siteConfig.lastModified,
		isPartOf: { "@id": websiteId },
		mainEntity: { "@id": personId },
		about: { "@id": personId },
	};
}

/** /resume: the page plus its Home → Resume breadcrumb trail. */
export function getResumeNodes(description: string): [WebPage, BreadcrumbList] {
	const breadcrumbId = `${resumeUrl}#breadcrumb`;

	return [
		{
			"@type": "WebPage",
			"@id": `${resumeUrl}#webpage`,
			url: resumeUrl,
			name: `Resume | ${siteConfig.siteName}`,
			description,
			inLanguage: siteConfig.language,
			dateModified: siteConfig.lastModified,
			isPartOf: { "@id": websiteId },
			about: { "@id": personId },
			breadcrumb: { "@id": breadcrumbId },
		},
		{
			"@type": "BreadcrumbList",
			"@id": breadcrumbId,
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: siteConfig.url,
				},
				{ "@type": "ListItem", position: 2, name: "Resume", item: resumeUrl },
			],
		},
	];
}

/**
 * One JSON-LD graph per page: the shared WebSite and Person nodes plus the
 * page's own nodes, so every `@id` reference resolves within the page.
 */
export function buildGraph(...pageNodes: ReadonlyArray<Thing>): Graph {
	return {
		"@context": "https://schema.org",
		"@graph": [getWebSiteNode(), getPersonNode(), ...pageNodes],
	};
}
