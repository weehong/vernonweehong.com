import type { Graph } from "schema-dts";

/**
 * A JSON-LD structured-data <script>. `<` is escaped so the payload can never
 * close the tag (the Next.js JSON-LD guide).
 */
export function JsonLd({ data }: { readonly data: Graph }): React.ReactElement {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replaceAll("<", "\\u003c"),
			}}
		/>
	);
}
