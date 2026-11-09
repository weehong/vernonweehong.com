export function SiteFooter({
	role,
	year,
}: {
	readonly role: string;
	readonly year: number;
}): React.ReactElement {
	return (
		<footer className="border-t border-rule">
			<div className="mx-auto flex max-w-page flex-wrap justify-between gap-x-6 gap-y-2 py-6 page-gutter font-mono text-meta text-ink-muted">
				<span>© {year} Vernon Wee Hong KOH</span>
				<span>{role}</span>
			</div>
		</footer>
	);
}
