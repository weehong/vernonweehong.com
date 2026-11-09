import { NowNote } from "@/components/home/now-note";
import { Section } from "@/components/ui/section";
import type { Locale } from "@/lib/i18n/locales";
import type { Profile } from "@/lib/profile";

/** §1 About. */
export function AboutSection({
	locale,
	about,
}: {
	readonly locale: Locale;
	readonly about: Profile["about"];
}): React.ReactElement {
	const [lead, body] = about.paragraphs;
	return (
		<Section
			id="about"
			n={1}
			label={about.label}
			heading={about.heading}
			narrow={locale === "en"}
		>
			<div className="flex flex-wrap gap-x-12 gap-y-8">
				<div className="flex min-w-0 max-w-[62ch] flex-[999_1_420px] flex-col gap-5">
					<p className="text-lead text-ink">{lead}</p>
					<p className="text-body text-ink-soft">{body}</p>
				</div>
				<NowNote label={about.nowLabel} now={about.now} />
			</div>
		</Section>
	);
}
