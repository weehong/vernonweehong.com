import {
	PageShell,
	type PageLinks,
	type ShellProps,
} from "@/components/layout/page-shell";

export function HomeLayout({
	linkColumn,
	children,
	...shell
}: ShellProps & { readonly linkColumn: PageLinks }): React.ReactElement {
	return (
		<PageShell {...shell} linkColumn={linkColumn} stack="flex flex-col">
			{children}
		</PageShell>
	);
}
