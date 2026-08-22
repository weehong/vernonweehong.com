import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import Script from "next/script";
import { JsonLd } from "@/components/json-ld";
import { isProductionEnv, siteConfig } from "@/lib/site-config";
import { getPersonSchema, getWebSiteSchema } from "@/lib/structured-data";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["500", "600", "700"],
	display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: ["400", "500"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	keywords: [...siteConfig.keywords],
	authors: [{ name: siteConfig.author }],
	creator: siteConfig.creator,
	alternates: { canonical: "/" },
	openGraph: {
		type: "profile",
		url: "/",
		siteName: siteConfig.name,
		title: siteConfig.name,
		description: siteConfig.description,
		locale: siteConfig.locale,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
	},
	robots: isProductionEnv
		? {
				index: true,
				follow: true,
				googleBot: {
					index: true,
					follow: true,
					"max-image-preview": "large",
					"max-snippet": -1,
					"max-video-preview": -1,
				},
			}
		: { index: false, follow: false },
	manifest: "/manifest.webmanifest",
	appleWebApp: {
		capable: true,
		title: siteConfig.shortName,
		statusBarStyle: "default",
	},
	formatDetection: { telephone: false },
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	colorScheme: "light dark",
	themeColor: [
		{
			media: "(prefers-color-scheme: light)",
			color: siteConfig.themeColor.light,
		},
		{
			media: "(prefers-color-scheme: dark)",
			color: siteConfig.themeColor.dark,
		},
	],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${poppins.variable} ${jetBrainsMono.variable}`}
			suppressHydrationWarning
		>
			<body>
				<JsonLd data={getWebSiteSchema()} />
				<JsonLd data={getPersonSchema()} />
				{children}
				<Script id="theme-init" strategy="beforeInteractive">
					{`try{var t=localStorage.getItem("vwhk-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.add(d?"dark":"light")}catch(e){}`}
				</Script>
			</body>
		</html>
	);
}
