/**
 * Remark plugin for post bodies: marks the first paragraph as the lead and
 * passes a code fence's language and `title="File.java"` to the renderer.
 */

type Node = {
	type: string;
	lang?: string | null;
	meta?: string | null;
	children?: Array<Node>;
	data?: { hProperties?: Record<string, unknown> };
};

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
			node.children?.forEach(visit);
		};
		visit(tree);
	};
}
