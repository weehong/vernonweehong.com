import { Font } from "@react-pdf/renderer";

/**
 * Fonts for the resume PDF. English uses Ubuntu Sans Mono (as the old
 * resume-main generator did); Chinese uses Noto Sans SC, subset by Google
 * Fonts to the characters on the page so the PDF stays small.
 */

const UBUNTU = "Ubuntu Sans Mono";
const NOTO = "Noto Sans SC";

/**
 * The font file as a data URL. Downloaded here, inside a cached function,
 * so the PDF renderer never fetches anything itself: Next.js does not allow
 * fetch() from inside renderToBuffer while prerendering /resume.pdf.
 */
async function fontUrl(
	family: string,
	weight: number,
	text?: string
): Promise<string> {
	"use cache";
	const query = `family=${family.replaceAll(" ", "+")}:wght@${weight}${text ? `&text=${encodeURIComponent(text)}` : ""}`;
	const css = await (
		await fetch(`https://fonts.googleapis.com/css2?${query}`)
	).text();
	const source = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(
		css
	)?.[1];
	if (!source)
		throw new Error(
			`Could not load the ${family} ${weight} font for the resume PDF.`
		);
	const data = Buffer.from(await (await fetch(source)).arrayBuffer());
	return `data:font/ttf;base64,${data.toString("base64")}`;
}

/** Registers the fonts and returns the family to use. */
export async function registerResumeFonts(
	chinese: boolean,
	text: string
): Promise<string> {
	if (chinese) {
		const subset = [...new Set(text)].join("");
		const [regular, bold] = await Promise.all([
			fontUrl(NOTO, 400, subset),
			fontUrl(NOTO, 700, subset),
		]);
		Font.register({
			family: NOTO,
			fonts: [
				{ src: regular, fontWeight: 400 },
				{ src: bold, fontWeight: 700 },
			],
		});
		return NOTO;
	}
	const [regular, medium, bold] = await Promise.all([
		fontUrl(UBUNTU, 400),
		fontUrl(UBUNTU, 500),
		fontUrl(UBUNTU, 700),
	]);
	Font.register({
		family: UBUNTU,
		fonts: [
			{ src: regular, fontWeight: 400 },
			{ src: medium, fontWeight: 500 },
			{ src: bold, fontWeight: 700 },
		],
	});
	// Keep words whole: no automatic hyphenation inside words.
	Font.registerHyphenationCallback((word) => [word]);
	return UBUNTU;
}
