import Link from "next/link";
import { ProfileCardPanel } from "@/components/home/profile-card-panel";
import { ButtonGroup, buttonClasses } from "@/components/ui/buttons";
import { Highlight } from "@/components/ui/highlight";
import { ArrowIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localePath, type Locale } from "@/lib/i18n/locales";
import type { Profile } from "@/lib/profile";

export function Hero({
	locale,
	hero,
	dictionary,
}: {
	readonly locale: Locale;
	readonly hero: Profile["hero"];
	readonly dictionary: Dictionary;
}): React.ReactElement {
	return (
		<section className="flex flex-wrap items-stretch gap-x-12 gap-y-10 pt-18">
			<div className="flex min-w-0 flex-[999_1_420px] flex-col gap-6">
				<p className="font-mono text-meta text-ink-muted">{hero.kicker}</p>
				<h1 className="font-display text-display-xl">
					Vernon
					<br />
					KOH
					<span className="text-marker [-webkit-text-stroke:2px_var(--ink)]">
						.
					</span>
				</h1>
				<p className="max-w-[20ch] font-display text-statement">
					<Highlight text={hero.statement} draw />
				</p>
				<p className="max-w-[48ch] text-lead text-ink-soft">{hero.intro}</p>
				<ButtonGroup>
					<Link
						href={localePath(locale, "/resume")}
						className={buttonClasses.secondary}
					>
						{dictionary.readResume}
					</Link>
					<a href="#contact" className={buttonClasses.primary}>
						{dictionary.contactMe}
						<ArrowIcon />
					</a>
				</ButtonGroup>
			</div>
			<ProfileCardPanel card={hero.profileCard} />
		</section>
	);
}
