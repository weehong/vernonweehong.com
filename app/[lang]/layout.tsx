import type { Metadata, Viewport } from "next";
import {
	Bricolage_Grotesque,
	Geist,
	Geist_Mono,
	Noto_Sans_SC,
} from "next/font/google";
import { notFound } from "next/navigation";
import { Providers } from "@/components/layout/providers";
import { ThemeScript } from "@/components/layout/theme-script";
import { hasLocale, htmlLang, locales } from "@/lib/i18n/locales";
import { siteMetadata, siteViewport } from "@/lib/metadata";
import "../globals.css";

const bricolage = Bricolage_Grotesque({
	variable: "--font-bricolage",
	subsets: ["latin"],
	weight: ["600", "700", "800"],
	display: "swap",
});

const geist = Geist({
	variable: "--font-geist",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	weight: ["400", "500"],
});

// Chinese edition only: its variable class is added to <html> for /zh, so the
// English edition never references (or downloads) it.
const notoSc = Noto_Sans_SC({
	variable: "--font-noto-sc",
	weight: ["400", "500", "700", "900"],
	preload: false,
});

export function generateStaticParams(): Array<{ lang: string }> {
	return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
	params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};
	return siteMetadata(lang);
}

export const viewport: Viewport = siteViewport;

export default async function RootLayout({
	children,
	params,
}: LayoutProps<"/[lang]">): Promise<React.ReactElement> {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const fontVariables = [
		bricolage.variable,
		geist.variable,
		geistMono.variable,
		...(lang === "zh" ? [notoSc.variable] : []),
	].join(" ");

	return (
		<html
			lang={htmlLang(lang)}
			className={fontVariables}
			suppressHydrationWarning
		>
			<body>
				<Providers>{children}</Providers>
				<ThemeScript />
			</body>
		</html>
	);
}
