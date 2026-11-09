/**
 * Remark plugin for post bodies: marks the first paragraph as the lead,
 * passes a code fence's language and `title="File.java"` to the renderer,
 * and turns GitHub-style alerts (`> [!TIP] Optional title`) into callouts.
 */

type Node = {
	type: string;
	value?: string;
	lang?: string | null;
	meta?: string | null;
	children?: Array<Node>;
	data?: { hProperties?: Record<string, unknown> };
};

export const CALLOUT_KINDS = [
	"note",
	"tip",
	"important",
	"warning",
	"caution",
] as const;

export type CalloutKind = (typeof CALLOUT_KINDS)[number];

/** `[!KIND]` and the rest of its line (the optional custom title). */
const CALLOUT_MARKER =
	/^\[!(note|tip|important|warning|caution)\][ \t]*([^\n]*)(?:\n|$)/i;

/** Marks a blockquote that opens with `[!KIND]` and removes the marker line. */
function markCallout(quote: Node): void {
	const paragraph = quote.children?.[0];
	if (paragraph?.type !== "paragraph") return;
	const text = paragraph.children?.[0];
	if (text?.type !== "text" || text.value === undefined) return;
	const match = CALLOUT_MARKER.exec(text.value);
	if (!match) return;

	const kind = (match[1] ?? "note").toLowerCase();
	const title = (match[2] ?? "").trim();
	text.value = text.value.slice(match[0].length);
	if (text.value === "") paragraph.children?.shift();
	if (paragraph.children?.length === 0) quote.children?.shift();

	quote.data = {
		...quote.data,
		hProperties: {
			...quote.data?.hProperties,
			dataCallout: kind,
			...(title ? { dataTitle: title } : {}),
		},
	};
}

export function remarkPost() {
	return (tree: Node): void => {
		const first = tree.children?.find((node) => node.type === "paragraph");
		if (first)
			first.data = {
				...first.data,
				hProperties: { ...first.data?.hProperties, dataLead: "true" },
			};

		const visit = (node: Node): void => {
			if (node.type === "code") {
				const title = /title="([^"]+)"/.exec(node.meta ?? "")?.[1];
				node.data = {
					...node.data,
					hProperties: {
						dataLang: node.lang ?? "text",
						...(title ? { dataTitle: title } : {}),
					},
				};
			}
			if (node.type === "blockquote") markCallout(node);
			node.children?.forEach(visit);
		};
		visit(tree);
	};
}
