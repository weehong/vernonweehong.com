/**
 * Raw colour values for the places that cannot read CSS variables: share
 * images (ImageResponse) and the browser `theme-color`. The only place outside
 * app/globals.css where colour values may appear (docs/design/README.md, rule
 * 1). A unit test checks every value against docs/design/theme.css.
 */
export const lightTokens = {
	paper: "#f4f5f2",
	raised: "#ffffff",
	sunken: "#eaece7",
	ink: "#12161c",
	inkSoft: "#3f4751",
	inkMuted: "#626a74",
	rule: "#d5d8d2",
	marker: "#ffd84d",
	markerInk: "#12161c",
	night: "#24303f",
	onNight: "#f4f5f2",
	dotsOnMarker: "rgb(18 22 28 / 0.22)",
} as const;

export const darkTokens = {
	paper: "#1c2128",
} as const;

/** The resume PDF: ink on white paper (print is exempt from the colour rule). */
export const printTokens = {
	paper: "#ffffff",
	ink: "#000000",
	inkSoft: "#222222",
	inkMuted: "#444444",
	rule: "#000000",
} as const;
