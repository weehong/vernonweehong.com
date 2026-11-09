import { ImageResponse } from "next/og";
import { ShareImage } from "@/components/share/share-image";
import { shareFonts } from "@/lib/share/fonts";

export const shareSize = { width: 1200, height: 630 } as const;

/** Renders a share image; the image route files only call this. */
export async function renderShareImage(options: {
	readonly lead: string;
	readonly highlight: string;
	readonly tail?: string;
	readonly label?: string;
	readonly chinese: boolean;
}): Promise<ImageResponse> {
	const fonts = await shareFonts(
		`${options.lead}${options.highlight}${options.tail ?? ""}`,
		options.label ?? "",
		options.chinese
	);
	return new ImageResponse(<ShareImage {...options} />, {
		...shareSize,
		fonts,
	});
}
