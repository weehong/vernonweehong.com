import type { Metadata } from "next";
import { lang } from "next/root-params";
import { NotFoundMessage } from "@/components/errors/not-found-message";
import { NotFoundLayout } from "@/components/layout/not-found-layout";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
	alternatesFor,
	defaultLocale,
	hasLocale,
	localePath,
} from "@/lib/i18n/locales";

export async function generateMetadata(): Promise<Metadata> {
	const value = await lang();
	const locale = hasLocale(value) ? value : defaultLocale;
	return { title: getDictionary(locale).meta.notFoundTitle };
}

/** Per edition: unknown paths under /zh/… get the Chinese page. */
export default async function NotFound(): Promise<React.ReactElement> {
	const value = await lang();
	const locale = hasLocale(value) ? value : defaultLocale;
	const dict = getDictionary(locale);
	return (
		<NotFoundLayout
			locale={locale}
			dictionary={dict}
			alternates={alternatesFor("/")}
		>
			<NotFoundMessage homeHref={localePath(locale, "/")} dictionary={dict} />
		</NotFoundLayout>
	);
}
