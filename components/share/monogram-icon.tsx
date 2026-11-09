import { lightTokens as c } from "@/lib/design-tokens";

/** The VK monogram for the browser icon (ImageResponse: inline styles). */
export function MonogramIcon({
	size,
}: {
	readonly size: number;
}): React.ReactElement {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: c.marker,
				color: c.markerInk,
				borderRadius: Math.round(size * 0.19),
				fontSize: Math.round(size * 0.47),
				fontWeight: 800,
				letterSpacing: "-0.04em",
			}}
		>
			VK
		</div>
	);
}
