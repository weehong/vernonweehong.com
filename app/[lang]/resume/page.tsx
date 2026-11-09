import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResumeLayout } from "@/components/layout/resume-layout";
import { JsonLd } from "@/components/seo/json-ld";
import { ResumeHeader } from "@/components/resume/resume-header";
import {
	ResumeAwards,
	ResumeEducation,
	ResumeExperience,
	ResumeProjects,
	ResumeSkills,
	ResumeSummary,
	ResumeUpdated,
} from "@/components/resume/resume-sections";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatDate, hasLocale } from "@/lib/i18n/locales";
import { pageMetadata } from "@/lib/metadata";
import { getResume } from "@/lib/resume";
import { resumeGraph } from "@/lib/structured-data";

export async function generateMetadata({
	params,
}: PageProps<"/[lang]/resume">): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};
	return pageMetadata({
		locale: lang,
		title: getDictionary(lang).resume.kicker,
		description: getResume(lang).meta.description,
		path: "/resume",
	});
}

export default async function ResumePage({
	params,
}: PageProps<"/[lang]/resume">): Promise<React.ReactElement> {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = getDictionary(lang);
	const resume = getResume(lang);

	return (
		<ResumeLayout locale={lang} dictionary={dict}>
			<JsonLd data={resumeGraph(lang)} />
			<ResumeHeader kicker={dict.resume.kicker} header={resume.header} />
			<ResumeSummary resume={resume} dictionary={dict} />
			<ResumeSkills resume={resume} dictionary={dict} locale={lang} />
			<ResumeExperience resume={resume} dictionary={dict} locale={lang} />
			<ResumeProjects resume={resume} dictionary={dict} />
			<ResumeAwards resume={resume} dictionary={dict} />
			<ResumeEducation resume={resume} dictionary={dict} />
			<ResumeUpdated
				date={formatDate(lang, resume.updated)}
				dictionary={dict}
			/>
		</ResumeLayout>
	);
}
