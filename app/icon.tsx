import { ImageResponse } from "next/og";
import { MonogramIcon } from "@/components/share/monogram-icon";

const SIZES = [32, 192, 512] as const;

export function generateImageMetadata(): Array<{
	id: string;
	size: { width: number; height: number };
	contentType: string;
}> {
	return SIZES.map((size) => ({
		id: String(size),
		size: { width: size, height: size },
		contentType: "image/png",
	}));
}

/** The VK monogram at 32 (favicon), 192 and 512 (web app manifest). */
export default async function Icon({
	id,
}: {
	readonly id: Promise<string>;
}): Promise<ImageResponse> {
	const size = Number(await id);
	return new ImageResponse(<MonogramIcon size={size} />, {
		width: size,
		height: size,
	});
}
