import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Vercel packages the server itself; standalone output is for Docker.
	output: process.env["VERCEL"] ? undefined : "standalone",
	serverExternalPackages: ["nodemailer"],
	turbopack: {
		root: process.cwd(),
	},
};

export default nextConfig;
