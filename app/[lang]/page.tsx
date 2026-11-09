import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutSection } from "@/components/home/about-section";
import { ContactPanel } from "@/components/home/contact-panel";
import { ExperienceSection } from "@/components/home/experience-section";
import { Hero } from "@/components/home/hero";
import { ProjectsSection } from "@/components/home/projects-section";
import { SkillsSection } from "@/components/home/skills-section";
import { JsonLd } from "@/components/seo/json-ld";
import { HomeLayout } from "@/components/layout/home-layout";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { alternatesFor, hasLocale } from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/metadata";
import { homeLinks } from "@/lib/page-links";
import { getProfile } from "@/lib/profile";
import { homeGraph } from "@/lib/structured-data";

export async function generateMetadata({
	params,
}: PageProps<"/[lang]">): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};
	const dict = getDictionary(lang);
	return pageMetadata({
		locale: lang,
		title: { absolute: dict.meta.title },
		description: dict.meta.description,
		path: "/",
	});
}

export default async function HomePage({
	params,
}: PageProps<"/[lang]">): Promise<React.ReactElement> {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = getDictionary(lang);
	const profile = getProfile(lang);

	return (
		<HomeLayout
			locale={lang}
			dictionary={dict}
			alternates={alternatesFor("/")}
			linkColumn={homeLinks(profile, dict)}
		>
			<JsonLd data={homeGraph(lang)} />
			<Hero locale={lang} hero={profile.hero} dictionary={dict} />
			<AboutSection locale={lang} about={profile.about} />
			<ExperienceSection experience={profile.experience} />
			<ProjectsSection projects={profile.projects} />
			<SkillsSection skills={profile.skills} tableLabel={dict.tableScroll} />
			<ContactPanel contact={profile.contact} dictionary={dict} />
		</HomeLayout>
	);
}
