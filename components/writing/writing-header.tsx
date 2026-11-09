import { AiNote } from "@/components/writing/ai-note";
import { buttonClasses } from "@/components/ui/buttons";
import { Highlight } from "@/components/ui/highlight";
import { MailIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

export function WritingHeader({
	locale,
	dictionary,
}: {
	readonly locale: Locale;
	readonly dictionary: Dictionary;
}): React.ReactElement {
	return (
		<header className="flex flex-col gap-5">
			<p className="border-b-2 border-rule-strong pb-3 font-mono text-label uppercase">
				{dictionary.writing}
			</p>
			<div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
				<h1
					className={
						locale === "zh"
							? "max-w-[13em] flex-[999_1_420px] font-display text-display-lg"
							: "max-w-[16ch] flex-[999_1_420px] font-display text-display-lg"
					}
				>
					<Highlight text={dictionary.writingTitle} />
				</h1>
				<div className="flex flex-[1_1_260px] flex-col items-end gap-4">
					<p className="max-w-[34ch] text-right text-[17px] text-ink-soft">
						{dictionary.writingIntro}
					</p>
					<AiNote title={dictionary.ai.title} note={dictionary.ai.note} />
					<a href="#subscribe" className={buttonClasses.secondary}>
						<MailIcon className="size-4" />
						{dictionary.emailCta}
					</a>
				</div>
			</div>
		</header>
	);
}
