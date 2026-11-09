import { renderToBuffer } from "@react-pdf/renderer";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { getResume, resumeFileName } from "@/lib/resume";
import { registerResumeFonts } from "@/lib/resume-pdf/fonts";
import { ResumeDocument } from "@/lib/resume-pdf/resume-document";

/** Renders the edition's resume PDF from resume.json. */
export async function renderResumePdf(locale: Locale): Promise<ArrayBuffer> {
	const resume = getResume(locale);
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
