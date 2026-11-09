import { highlightCode } from "@/lib/writing/highlight";

/** A fenced code block: caption bar (file name · language), then the code. */
export async function CodeBlock({
	code,
	lang,
	title,
}: {
	readonly code: string;
	readonly lang: string;
	readonly title?: string;
}): Promise<React.ReactElement> {
	const lines = await highlightCode(code, lang);
	return (
		<figure className="my-1 overflow-hidden rounded-md border border-rule bg-raised">
			<figcaption className="flex justify-between gap-3 border-b border-rule bg-sunken px-4 py-2.5 font-mono text-label normal-case tracking-normal text-ink-muted">
				<span>{title ?? ""}</span>
				<span>{lang}</span>
			</figcaption>
			<pre className="m-0 overflow-x-auto px-5 py-4 font-mono text-code text-ink">
				<code>
					{lines.map((line, lineIndex) => (
						<span key={lineIndex} className="block">
							{line.map((token, tokenIndex) => (
								<span key={tokenIndex} className={token.className}>
									{token.content}
								</span>
							))}
							{line.length === 0 ? "\n" : null}
						</span>
					))}
				</code>
			</pre>
		</figure>
	);
}
