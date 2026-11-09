"use client";

import Link from "next/link";
import type { Alternates, Locale } from "@/lib/i18n/locales";

const ONE_YEAR = 60 * 60 * 24 * 365;

function remember(locale: Locale): void {
	// Lets `/` honour the choice next time (proxy.ts); never auto-redirects otherwise.
	document.cookie = `locale=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

/** EN / 中文 segmented control, linking to the same page in the other edition. */
export function LanguageSwitch({
	locale,
	alternates,
	label,
}: {
	readonly locale: Locale;
	readonly alternates: Alternates;
	readonly label: string;
}): React.ReactElement {
	return (
		<nav
			aria-label={label}
			className="inline-grid grid-cols-2 gap-0.5 rounded-[8px] border border-field-line p-0.5"
		>
			<Link
				href={alternates.en}
				lang="en"
				hrefLang="en"
				aria-current={locale === "en" ? "page" : undefined}
				onClick={() => {
					remember("en");
				}}
				className="inline-flex min-h-10 items-center justify-center rounded-sm px-3 font-mono text-meta font-medium no-underline text-ink-soft aria-[current=page]:bg-marker aria-[current=page]:text-marker-ink"
			>
				EN
			</Link>
			<Link
				href={alternates["zh-Hans"]}
				lang="zh-Hans"
				hrefLang="zh-Hans"
				aria-current={locale === "zh" ? "page" : undefined}
				onClick={() => {
					remember("zh");
				}}
				className="inline-flex min-h-10 items-center justify-center rounded-sm px-3 text-small font-medium no-underline [font-family:var(--font-noto-sc)] text-ink-soft aria-[current=page]:bg-marker aria-[current=page]:text-marker-ink"
			>
				中文
			</Link>
		</nav>
	);
}
