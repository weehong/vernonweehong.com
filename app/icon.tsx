import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

// Generated favicons served at /icon/<size>: 48px for browser tabs and Google
// Search results, 192px and 512px for the web app manifest. The large sizes
// are full-bleed with the mark inside the maskable-icon safe zone.
const iconSizes = [48, 192, 512] as const;

type IconMetadata = {
	id: string;
	size: { width: number; height: number };
	contentType: string;
};

export function generateImageMetadata(): Array<IconMetadata> {
	return iconSizes.map((dimension) => ({
		id: String(dimension),
		size: { width: dimension, height: dimension },
		contentType: "image/png",
	}));
}

export default async function Icon({
	id,
}: {
	readonly id: Promise<string | number>;
}): Promise<ImageResponse> {
	const dimension = Number(await id);
	const isFavicon = dimension <= 48;

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: siteConfig.themeColor.dark,
				color: "#e63946",
				fontSize: Math.round(dimension * (isFavicon ? 0.5625 : 0.4)),
				fontWeight: 700,
				borderRadius: isFavicon ? Math.round(dimension * 0.1875) : 0,
			}}
		>
			VK
		</div>,
		{ width: dimension, height: dimension }
	);
}
