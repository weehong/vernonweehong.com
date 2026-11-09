import { renderToBuffer } from "@react-pdf/renderer";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { getResume, resumeFileName, type Resume } from "@/lib/resume";
import { registerResumeFonts } from "@/lib/resume-pdf/fonts";
import { ResumeDocument } from "@/lib/resume-pdf/resume-document";

/** Renders a resume PDF: the edition's resume.json unless another is given. */
export async function renderResumePdf(
	locale: Locale,
	resume: Resume = getResume(locale)
): Promise<ArrayBuffer> {
	const dictionary = getDictionary(locale);
	const fontFamily = await registerResumeFonts(
		locale === "zh",
		JSON.stringify([resume, dictionary.resume])
	);
	const buffer = await renderToBuffer(
		<ResumeDocument
			resume={resume}
			dictionary={dictionary}
			locale={locale}
			fontFamily={fontFamily}
			title={resumeFileName(locale).replace(/\.pdf$/, "")}
		/>
	);
	return buffer.buffer.slice(
		buffer.byteOffset,
		buffer.byteOffset + buffer.byteLength
	) as ArrayBuffer;
}
