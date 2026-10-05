import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Vercel packages the server itself; standalone output is for Docker.
	output: process.env["VERCEL"] ? undefined : "standalone",
	serverExternalPackages: ["nodemailer"],
	turbopack: {
		root: process.cwd(),
	},
	// Serve one canonical host: permanently redirect www.<host> to <host>.
	// HTTP -> HTTPS is left to the hosting platform / reverse proxy.
	async redirects() {
		const siteUrl = process.env["NEXT_PUBLIC_SITE_URL"];
		if (!siteUrl) return [];

		const { host, protocol } = new URL(siteUrl);
		if (host.startsWith("www.")) return [];

		return [
			{
				source: "/:path*",
				has: [{ type: "host", value: `www.${host}` }],
				destination: `${protocol}//${host}/:path*`,
				permanent: true,
			},
		];
	},
};

export default nextConfig;
