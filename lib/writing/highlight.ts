import {
	createHighlighter,
	type BundledLanguage,
	type Highlighter,
	type ThemeRegistration,
} from "shiki";

/**
 * Build-time code highlighting (docs/design/components.md, PostBody). The
 * theme's "colours" are only markers for four token kinds; each maps to a
 * theme utility, so no colour value reaches the page.
 */
const KIND = {
	"#000001": "text-ink",
	"#000002": "text-ink-muted",
	"#000003": "text-code-keyword",
	"#000004": "text-code-type",
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
			scope: ["keyword", "storage", "constant.language", "variable.language"],
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
				"text-ink",
		}))
	);
}
