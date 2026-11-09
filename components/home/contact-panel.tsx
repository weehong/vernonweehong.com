import { ContactForm } from "@/components/home/contact-form";
import { SectionNumber } from "@/components/ui/chips";
import { Highlight } from "@/components/ui/highlight";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Profile } from "@/lib/profile";

/** §5 Contact: the page's inverted block. */
export function ContactPanel({
	contact,
	dictionary,
}: {
	readonly contact: Profile["contact"];
	readonly dictionary: Dictionary;
}): React.ReactElement {
	return (
		<section id="contact" className="pt-30">
			<div className="relative flex flex-wrap gap-x-14 gap-y-10 overflow-hidden rounded-md bg-night p-[clamp(24px,4vw,48px)] text-on-night">
				<div
					aria-hidden
					className="absolute top-0 right-0 h-40 w-[45%] dots-on-night"
				/>
				<div className="relative flex min-w-0 flex-[1_1_320px] flex-col gap-5">
					<p className="flex items-center gap-3 font-mono text-label uppercase text-on-night-soft">
						<SectionNumber onNight>§5</SectionNumber>
						{contact.label}
					</p>
					<h2 className="font-display text-display-md">
						<Highlight text={contact.heading} />
					</h2>
					<p className="max-w-[40ch] text-on-night-soft">{contact.intro}</p>
				</div>
				<ContactForm text={dictionary.contact} />
			</div>
		</section>
	);
}
