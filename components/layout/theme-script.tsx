import Script from "next/script";

/** localStorage key for the chosen theme, kept from the old site. */
export const THEME_STORAGE_KEY = "vwhk-theme";

const themeInit = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.add(d?"dark":"light")}catch(e){}`;

/** Sets the theme class on <html> before paint, so there is no flash. */
export function ThemeScript(): React.ReactElement {
	return (
		// Rendered only by the root layout (app/[lang]/layout.tsx), where the App
		// Router supports beforeInteractive; the rule predates the App Router.
		// eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
		<Script id="theme-init" strategy="beforeInteractive">
			{themeInit}
		</Script>
	);
}
