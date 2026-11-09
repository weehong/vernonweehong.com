import { CodeFrame, type CodeLabels } from "@/components/post/code-frame";
import { fill } from "@/lib/i18n/locales";
import { highlightCode } from "@/lib/writing/highlight";

/** A fenced code block: highlighted here, drawn by CodeFrame. */
export async function CodeBlock({
	code,
	lang,
	title,
	labels,
}: {
	readonly code: string;
	readonly lang: string;
	readonly title?: string;
	/** Dictionary labels; `showAll` holds `{n}`, filled with the line count. */
	readonly labels: CodeLabels;
}): Promise<React.ReactElement> {
	const lines = await highlightCode(code, lang);
	return (
		<CodeFrame
			lines={lines}
			lang={lang}
			{...(title ? { title } : {})}
			labels={{ ...labels, showAll: fill(labels.showAll, { n: lines.length }) }}
		/>
	);
}
