import { lightTokens as c } from "@/lib/design-tokens";

/**
 * The 1200 × 630 share image (docs/design/pages.md, Share images). Inline
 * styles because ImageResponse has no Tailwind; colours come from
 * lib/design-tokens.ts, always the light theme.
 */
export function ShareImage({
	lead,
	highlight,
	tail,
	label,
	chinese,
}: {
	/** Title text before the highlighted phrase. */
	readonly lead: string;
	readonly highlight: string;
	/** Title text after the highlighted phrase. */
	readonly tail?: string;
	/** Top-right mono label (Writing / 写作, Resume, or the post topic). */
	readonly label?: string;
	readonly chinese: boolean;
}): React.ReactElement {
	const titleFont = chinese ? "Noto Sans SC" : "Bricolage Grotesque";
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				position: "relative",
				background: c.paper,
				color: c.ink,
				padding: 72,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					width: 400,
					height: 630,
					backgroundImage: `radial-gradient(${c.dotsOnMarker} 1.2px, transparent 1.6px)`,
					backgroundSize: "16px 16px",
				}}
			/>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: 20 }}>
						<div
							style={{
								width: 64,
								height: 64,
								borderRadius: 6,
								background: c.marker,
								color: c.markerInk,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontFamily: "Bricolage Grotesque",
								fontSize: 30,
								fontWeight: 800,
							}}
						>
							VK
						</div>
						<div
							style={{
								fontFamily: "Bricolage Grotesque",
								fontSize: 34,
								fontWeight: 800,
							}}
						>
							Vernon KOH
						</div>
					</div>
					{label ? (
						<div
							style={{
								fontFamily: chinese ? "Noto Sans SC" : "Geist Mono",
								fontSize: 24,
								color: c.inkSoft,
							}}
						>
							{label}
						</div>
					) : null}
				</div>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						maxWidth: 900,
						fontFamily: titleFont,
						fontSize: 76,
						fontWeight: chinese ? 900 : 800,
						lineHeight: 1.1,
						letterSpacing: chinese ? 0 : "-0.03em",
						lineClamp: 2,
					}}
				>
					<span>{lead}</span>
					<span
						style={{
							background: c.marker,
							color: c.markerInk,
							padding: "0 10px",
							borderRadius: 3,
						}}
					>
						{highlight}
					</span>
					{tail ? <span>{tail}</span> : null}
				</div>
			</div>
		</div>
	);
}
