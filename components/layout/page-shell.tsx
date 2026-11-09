import {
	LinkColumn,
	type ElsewhereItem,
	type PageSection,
} from "@/components/layout/link-column";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteMenu } from "@/components/layout/site-menu";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Alternates, Locale } from "@/lib/i18n/locales";
import { copyrightYear } from "@/lib/site-config";

export type PageLinks = {
	readonly sections: ReadonlyArray<PageSection>;
	readonly links: ReadonlyArray<ElsewhereItem>;
	/** Heading of the section list: «On this page» or «On this post». */
	readonly title?: string;
};

export type ShellProps = {
	readonly locale: Locale;
	readonly dictionary: Dictionary;
	readonly alternates: Alternates;
	readonly children: React.ReactNode;
};

/**
 * The frame shared by the PageShell layouts (docs/design/components.md).
 * Only page layouts render it; `stack` comes from the layouts table.
 */
export function PageShell({
	locale,
	dictionary,
	alternates,
	linkColumn,
	stack,
	children,
}: ShellProps & {
	readonly linkColumn?: PageLinks;
	readonly stack: string;
}): React.ReactElement {
	const labels = {
		pageLinks: dictionary.pageLinks,
		onThisPage: linkColumn?.title ?? dictionary.onThisPage,
		elsewhere: dictionary.elsewhere,
		themeToDark: dictionary.themeToDark,
		themeToLight: dictionary.themeToLight,
	};
	return (
		<div className="min-h-screen bg-paper text-ink font-sans text-body">
			<SiteHeader
				locale={locale}
				dictionary={dictionary}
				alternates={alternates}
				{...(linkColumn
					? {
							menu: (
								<SiteMenu
									sections={linkColumn.sections}
									links={linkColumn.links}
									labels={{
										...labels,
										menu: dictionary.menu.title,
										open: dictionary.menu.open,
										close: dictionary.menu.close,
									}}
								/>
							),
						}
					: {})}
			/>
			<div className="mx-auto flex max-w-page flex-wrap items-start gap-x-16 page-gutter">
				{linkColumn && (
					<LinkColumn
						sections={linkColumn.sections}
						links={linkColumn.links}
						labels={labels}
					/>
				)}
				<main className={`min-w-0 flex-[999_1_640px] pt-18 pb-24 ${stack}`}>
					{children}
				</main>
			</div>
			<SiteFooter role={dictionary.footerRole} year={copyrightYear} />
		</div>
	);
}
