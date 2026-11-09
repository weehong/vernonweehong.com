import {
	createHighlighter,
	type BundledLanguage,
	type Highlighter,
	type ThemeRegistration,
} from "shiki";

/**
 * Build-time code highlighting (docs/design/components.md, CodeBlock). The
 * theme's "colours" are only markers for token kinds; each maps to a theme
 * utility, so no colour value reaches the page and each kind swaps with the
 * light/dark theme.
 */
const KIND = {
	"#000001": "text-code-text",
	"#000002": "text-ink-muted",
	"#000003": "text-code-keyword",
	"#000004": "text-code-type",
	"#000005": "text-code-string",
	"#000006": "text-code-number",
	"#000007": "text-code-function",
	"#000008": "text-code-tag",
	"#000009": "text-code-attr",
} as const;

const theme: ThemeRegistration = {
	name: "vk-tokens",
	type: "light",
	colors: { "editor.foreground": "#000001", "editor.background": "#000000" },
	tokenColors: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: { foreground: "#000002" },
		},
		{
			scope: ["keyword", "storage", "variable.language"],
			settings: { foreground: "#000003" },
		},
		{
			scope: [
				"entity.name.type",
				"entity.name.class",
				"support.type",
				"support.class",
				"entity.other.inherited-class",
			],
			settings: { foreground: "#000004" },
		},
		{
			scope: ["string", "punctuation.definition.string"],
			settings: { foreground: "#000005" },
		},
		{
			scope: ["constant.numeric", "constant.language", "constant.character"],
			settings: { foreground: "#000006" },
		},
		{
			scope: ["entity.name.function", "support.function"],
			settings: { foreground: "#000007" },
		},
		{
			scope: ["entity.name.tag", "support.class.component"],
			settings: { foreground: "#000008" },
		},
		{
			scope: ["entity.other.attribute-name"],
			settings: { foreground: "#000009" },
		},
	],
};

const LANGS = [
	"java",
	"kotlin",
	"typescript",
	"tsx",
	"javascript",
	"json",
	"yaml",
	"bash",
	"sql",
	"go",
	"csharp",
	"xml",
	"html",
	"css",
	"diff",
];

let highlighter: Promise<Highlighter> | undefined;

export type CodeToken = {
	readonly content: string;
	readonly className: string;
};

/** Lines of tokens, each with the theme utility for its kind. */
export async function highlightCode(
	code: string,
	lang: string
): Promise<Array<Array<CodeToken>>> {
	"use cache";
	highlighter ??= createHighlighter({ themes: [theme], langs: LANGS });
	const instance = await highlighter;
	const language = (
		instance.getLoadedLanguages().includes(lang) ? lang : "text"
	) as BundledLanguage | "text";
	const { tokens } = instance.codeToTokens(code.replace(/\n$/, ""), {
		lang: language,
		theme: "vk-tokens",
	});
	return tokens.map((line) =>
		line.map((token) => ({
			content: token.content,
			className:
				KIND[(token.color ?? "").toLowerCase() as keyof typeof KIND] ??
				"text-code-text",
		}))
	);
}
