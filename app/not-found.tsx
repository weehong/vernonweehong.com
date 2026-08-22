import type { Metadata } from "next";
import Link from "next/link";

// Next.js automatically injects <meta name="robots" content="noindex"> for
// pages that return a 404 status.
export const metadata: Metadata = {
	title: "404 – Page not found",
	description: "The page you are looking for does not exist.",
};

export default function NotFound(): React.ReactElement {
	return (
		<div className="not-found">
			<p className="eyebrow">Lost endpoint</p>
			<h1>404</h1>
			<p>The page you are looking for does not exist.</p>
			<Link href="/" className="button button-primary">
				Go back home
			</Link>
		</div>
	);
}
