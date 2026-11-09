/**
 * Fonts for share images. ImageResponse cannot use next/font, so the TTFs are
 * fetched from Google Fonts at build time, subset to the text being drawn.
 */

export type ShareFont = {
	readonly name: string;
	readonly data: ArrayBuffer;
	readonly weight: 500 | 800 | 900;
	readonly style: "normal";
};

async function loadGoogleFont(
	family: string,
	weight: number,
	text: string
): Promise<ArrayBuffer> {
	"use cache";
	const url = `https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
	const css = await (await fetch(url)).text();
	const source = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(
		css
	)?.[1];
	if (!source)
		throw new Error(
			`Could not load the ${family} ${weight} font for a share image.`
		);
	return (await fetch(source)).arrayBuffer();
}

/** Bricolage 800 for the title, Geist (Mono) 500 for labels, Noto Sans SC 900 for Chinese titles. */
export async function shareFonts(
	title: string,
	label: string,
	chinese: boolean
): Promise<Array<ShareFont>> {
	const latin = `${title}${label}VKVernon KOH`;
	const fonts: Array<Promise<ShareFont>> = [
		loadGoogleFont("Bricolage Grotesque", 800, latin).then((data) => ({
			name: "Bricolage Grotesque",
			data,
			weight: 800,
			style: "normal",
		})),
	];
	// Chinese labels are drawn in Noto Sans SC; Geist Mono has no CJK glyphs.
	if (!chinese && label) {
		fonts.push(
			loadGoogleFont("Geist Mono", 500, `${label}`).then((data) => ({
				name: "Geist Mono",
				data,
				weight: 500,
				style: "normal",
			}))
		);
	}
	if (chinese) {
		fonts.push(
			loadGoogleFont("Noto Sans SC", 900, `${title}${label}`).then((data) => ({
				name: "Noto Sans SC",
				data,
				weight: 900,
				style: "normal",
			}))
		);
	}
	return Promise.all(fonts);
}
