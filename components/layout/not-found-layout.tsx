import { PageShell, type ShellProps } from "@/components/layout/page-shell";

export function NotFoundLayout({
	children,
	...shell
}: ShellProps): React.ReactElement {
	return (
		<PageShell
			{...shell}
			stack="flex min-h-[70vh] flex-col items-start justify-center gap-6"
		>
			{children}
		</PageShell>
	);
}
