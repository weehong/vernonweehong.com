import Link from "next/link";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { AvailabilityBadge } from "@/components/ui/chips";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localePath, type Alternates, type Locale } from "@/lib/i18n/locales";

export function SiteHeader({
	locale,
	dictionary,
	alternates,
	menu,
}: {
	readonly locale: Locale;
	readonly dictionary: Dictionary;
	readonly alternates: Alternates;
	/** SiteMenu, on pages with a link column; last in the right group. */
	readonly menu?: React.ReactNode;
}): React.ReactElement {
	return (
		<header className="border-b border-rule">
			<div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 page-gutter">
				<Link
					href={localePath(locale, "/")}
					className="inline-flex min-h-11 items-center gap-2.5 font-display text-xl font-bold tracking-title text-ink no-underline"
				>
					<span
						aria-hidden
						className="inline-flex size-8 items-center justify-center rounded-sm bg-marker font-display text-[15px] font-extrabold tracking-[-0.04em] text-marker-ink"
					>
						VK
					</span>
					Vernon KOH
				</Link>
				<div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
					<AvailabilityBadge>{dictionary.badge}</AvailabilityBadge>
					<LanguageSwitch
						locale={locale}
						alternates={alternates}
						label={dictionary.langNav}
					/>
					{menu}
				</div>
			</div>
		</header>
	);
}
