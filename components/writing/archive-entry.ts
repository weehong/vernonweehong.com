import type { SearchablePost } from "@/lib/writing/search";

/** A post as the Writing index needs it, with display strings made on the server. */
export type ArchiveEntry = Omit<SearchablePost, "body"> & {
	readonly href: string;
	/** "12 Nov 2026" / "2026年11月12日" */
	readonly date: string;
	readonly minutesLabel: string;
	readonly number: string;
};
