import { ImageResponse } from "next/og";
import { MonogramIcon } from "@/components/share/monogram-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon(): ImageResponse {
	return new ImageResponse(<MonogramIcon size={180} />, size);
}
