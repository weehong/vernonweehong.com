import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

// Generated social-share image (/opengraph-image), 1200x630.
// next/og supports flexbox + a subset of CSS only.
export const alt = siteConfig.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: "80px",
				background: siteConfig.themeColor.dark,
				color: siteConfig.themeColor.light,
			}}
		>
			<div
				style={{
					display: "flex",
					fontSize: 24,
					letterSpacing: 5,
					color: "#aac7da",
				}}
			>
				BACKEND ENGINEER · SINGAPORE
			</div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						display: "flex",
						fontSize: 76,
						fontWeight: 700,
						lineHeight: 1.05,
					}}
				>
					Vernon Wee Hong{" "}
					<span style={{ color: "#e63946", marginLeft: 20 }}>KOH</span>
				</div>
				<div
					style={{
						display: "flex",
						marginTop: 28,
						fontSize: 30,
						color: "#c5bfbf",
						maxWidth: 940,
					}}
				>
					Production REST services and API platforms that hold up in production.
				</div>
			</div>
			<div style={{ display: "flex", gap: 18, fontSize: 22, color: "#a8dadc" }}>
				Java · Spring Boot · TypeScript · REST
			</div>
		</div>,
		{ ...size }
	);
}
