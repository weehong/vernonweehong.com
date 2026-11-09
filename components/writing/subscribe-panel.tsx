import { SubscribeForm } from "@/components/writing/subscribe-form";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localePath, type Locale } from "@/lib/i18n/locales";

/** End of the Writing index and after every post. */
export function SubscribePanel({
	locale,
	dictionary,
}: {
	readonly locale: Locale;
	readonly dictionary: Dictionary;
}): React.ReactElement {
	const text = dictionary.subscribe;
	return (
		<section
			id="subscribe"
			aria-labelledby="subscribe-title"
			className="flex flex-wrap items-center gap-x-10 gap-y-6 rounded-md bg-marker dots-on-marker bg-top-right p-8 text-marker-ink"
		>
			<div className="flex flex-[1_1_280px] flex-col gap-2">
				<p className="font-mono text-label uppercase">{text.eyebrow}</p>
				<h2 id="subscribe-title" className="font-display text-title">
					{text.title}
				</h2>
				<p className="max-w-[42ch] text-body-sm">{text.desc}</p>
			</div>
			<div className="min-w-0 flex-[1_1_340px]">
				<SubscribeForm
					text={text}
					privacyHref={localePath(locale, "/privacy")}
					feedHref={localePath(locale, "/feed.xml")}
				/>
			</div>
		</section>
	);
}
