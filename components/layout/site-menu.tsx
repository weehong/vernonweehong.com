"use client";

import { useEffect, useRef, useState } from "react";
import {
	LinkColumn,
	type LinkColumnProps,
} from "@/components/layout/link-column";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

const iconButton =
	"inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-field-line bg-transparent text-ink hover:border-ink";

/**
 * Below `lg` the LinkColumn is hidden; this header button opens the same links
 * in a modal sheet from the right (docs/design/components.md, SiteMenu).
 */
export function SiteMenu({
	sections,
	links,
	labels,
}: Omit<LinkColumnProps, "variant" | "onNavigate"> & {
	readonly labels: LinkColumnProps["labels"] & {
		readonly menu: string;
		readonly open: string;
		readonly close: string;
	};
}): React.ReactElement {
	const dialog = useRef<HTMLDialogElement>(null);
	const [open, setOpen] = useState(false);
	const close = (): void => {
		dialog.current?.close();
	};

	// The sheet only exists below lg: close it if the window grows past that.
	useEffect(() => {
		const desktop = window.matchMedia("(min-width: 64rem)");
		const onChange = (): void => {
			if (desktop.matches) dialog.current?.close();
		};
		desktop.addEventListener("change", onChange);
		return (): void => {
			desktop.removeEventListener("change", onChange);
		};
	}, []);

	return (
		<>
			<button
				type="button"
				aria-label={labels.open}
				aria-haspopup="dialog"
				aria-expanded={open}
				onClick={() => {
					dialog.current?.showModal();
					setOpen(true);
				}}
				className={`${iconButton} lg:hidden`}
			>
				<MenuIcon />
			</button>
			<dialog
				ref={dialog}
				aria-label={labels.menu}
				onClose={() => {
					setOpen(false);
				}}
				onClick={(event) => {
					// A click on the backdrop lands on the dialog element itself.
					if (event.target === event.currentTarget) close();
				}}
				className="fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-full max-w-90 overflow-y-auto border-0 border-l border-rule bg-paper p-0 text-ink shadow-lift backdrop:bg-paper/80"
			>
				<div className="flex min-h-full flex-col gap-6 px-5 pt-4 pb-10">
					<div className="flex items-center justify-between gap-3">
						<p className="pl-3 font-mono text-label uppercase text-ink-muted">
							{labels.menu}
						</p>
						<button
							type="button"
							aria-label={labels.close}
							onClick={close}
							className={iconButton}
						>
							<CloseIcon />
						</button>
					</div>
					<LinkColumn
						sections={sections}
						links={links}
						labels={labels}
						variant="menu"
						onNavigate={close}
					/>
				</div>
			</dialog>
		</>
	);
}
