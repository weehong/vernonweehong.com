import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { localize } from "@/lib/content/localize";
import { hasLocale } from "@/lib/i18n/locales";
import type { Resume } from "@/lib/resume";
import { renderResumePdf } from "@/lib/resume-pdf/render";

/**
 * Renders a job-specific resume to PDF (docs/agents/job-resume.md):
 *   npm run job-resume -- <folder under resumes/> [en|zh]
 * Reads resumes/<folder>/resume.json (the shape of
 * docs/design/copywriting/resume.json) and writes resume.pdf beside it.
 */
async function main(): Promise<void> {
	const [folder, lang = "en"] = process.argv.slice(2);
	if (!folder || !/^[a-z0-9-]+$/.test(folder) || !hasLocale(lang)) {
		throw new Error("Usage: npm run job-resume -- <folder> [en|zh]");
	}
	const directory = join(process.cwd(), "resumes", folder);
	const source: unknown = JSON.parse(
		readFileSync(join(directory, "resume.json"), "utf8")
	);
	const pdf = await renderResumePdf(lang, localize(source, lang) as Resume);
	const file = join(directory, lang === "en" ? "resume.pdf" : "resume.zh.pdf");
	writeFileSync(file, Buffer.from(pdf));
	console.log(file);
}

await main();
