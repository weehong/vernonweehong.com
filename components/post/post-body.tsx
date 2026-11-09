import { evaluate } from "@mdx-js/mdx";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/post/code-block";
import { headingId } from "@/lib/writing/post-check";
import { remarkPost } from "@/lib/writing/remark-post";

type WithChildren = { readonly children?: ReactNode };

function textOf(children: ReactNode): string {
	if (typeof children === "string" || typeof children === "number")
		return String(children);
	if (Array.isArray(children)) return children.map(textOf).join("");
	if (children && typeof children === "object" && "props" in children) {
		return textOf((children.props as WithChildren).children);
	}
	return "";
}

/** The MDX element map (docs/design/components.md, PostBody). */
function components(): Record<
	string,
	(props: Record<string, unknown>) => React.ReactNode
> {
	let section = 0;
	return {
		p: ({ children, ...props }: WithChildren & Record<string, unknown>) =>
			props["data-lead"] === "true" ? (
				<p className="m-0 text-[19px] text-ink">{children}</p>
			) : (
				<p className="m-0">{children}</p>
			),
		h2: ({ children }: WithChildren): React.ReactElement => {
			section += 1;
			return (
				<h2
					id={headingId(textOf(children))}
					className="mt-7 font-display text-title text-ink"
				>
					<span className="mr-2.5 font-mono text-base font-medium tracking-normal text-ink-muted">
						§{section}
					</span>
					{children}
				</h2>
			);
		},
		h3: ({ children }: WithChildren) => (
			<h3 className="mt-4 font-display text-title-sm text-ink">{children}</h3>
		),
		ul: ({ children }: WithChildren) => (
			<ul className="m-0 flex list-disc flex-col gap-2 pl-5.5 marker:text-ink-muted">
				{children}
			</ul>
		),
		ol: ({ children }: WithChildren) => (
			<ol className="m-0 flex list-decimal flex-col gap-2 pl-5.5 marker:text-ink-muted">
				{children}
			</ol>
		),
		a: ({
			href = "",
			children,
		}: ComponentPropsWithoutRef<"a">): React.ReactElement => {
			const className =
				"text-ink underline decoration-field-line underline-offset-3 hover:decoration-ink";
			return href.startsWith("/") ? (
				<Link href={href} className={className}>
					{children}
				</Link>
			) : (
				<a href={href} rel="noreferrer" className={className}>
					{children}
				</a>
			);
		},
		strong: ({ children }: WithChildren) => (
			<strong className="font-semibold text-ink">{children}</strong>
		),
		code: ({ children }: WithChildren) => (
			<code className="rounded-xs bg-sunken px-1.5 py-px font-mono text-[15px] text-ink">
				{children}
			</code>
		),
		blockquote: ({ children }: WithChildren) => (
			<blockquote className="my-2 rounded-md bg-sunken px-5 py-4 font-display text-[22px] font-semibold leading-[1.35] tracking-title text-ink">
				{children}
			</blockquote>
		),
		pre: ({ children }: WithChildren): React.ReactElement => {
			const code = children as { props?: Record<string, unknown> } | undefined;
			const props = code?.props ?? {};
			const title =
				typeof props["data-title"] === "string"
					? props["data-title"]
					: undefined;
			return (
				<CodeBlock
					code={textOf(props["children"] as ReactNode)}
					lang={
						typeof props["data-lang"] === "string" ? props["data-lang"] : "text"
					}
					{...(title ? { title } : {})}
				/>
			);
		},
		img: ({ src, alt }: ComponentPropsWithoutRef<"img">) => (
			<figure className="m-0 flex flex-col gap-2">
				{/* Post images are plain files in /public; nothing for next/image to optimise. */}
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={typeof src === "string" ? src : ""}
					alt={alt ?? ""}
					loading="lazy"
					className="rounded-md border border-rule"
				/>
				{alt && (
					<figcaption className="font-mono text-meta text-ink-muted">
						{alt}
					</figcaption>
				)}
			</figure>
		),
	};
}

/** A post's Markdown body. */
export async function PostBody({
	source,
}: {
	readonly source: string;
}): Promise<React.ReactElement> {
	const { default: Body } = await evaluate(source, {
		...runtime,
		remarkPlugins: [remarkGfm, remarkPost],
	});
	return (
		<article className="flex max-w-reading flex-col gap-5 text-prose text-ink-soft">
			<Body components={components()} />
		</article>
	);
}
