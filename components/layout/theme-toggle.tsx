"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/components/layout/theme-script";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

function subscribe(onChange: () => void): () => void {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
	return () => {
		observer.disconnect();
	};
}

const isDarkNow = (): boolean =>
	document.documentElement.classList.contains("dark");

/** Icon-only, 44px, at the right end of the "On this page" label row. */
export function ThemeToggle({
	toDark,
	toLight,
}: {
	readonly toDark: string;
	readonly toLight: string;
}): React.ReactElement {
	const isDark = useSyncExternalStore(subscribe, isDarkNow, () => false);
	const label = isDark ? toLight : toDark;

	function toggle(): void {
		const next = isDark ? "light" : "dark";
		document.documentElement.classList.remove("dark", "light");
		document.documentElement.classList.add(next);
		try {
			localStorage.setItem(THEME_STORAGE_KEY, next);
		} catch {
			// Storage can be blocked; the theme still changes for this page.
		}
	}

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={label}
			title={label}
			className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm border border-field-line bg-transparent text-ink hover:border-ink"
		>
			{isDark ? (
				<SunIcon className="size-5" />
			) : (
				<MoonIcon className="size-5" />
			)}
		</button>
	);
}
