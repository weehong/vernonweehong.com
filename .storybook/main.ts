import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	stories: [
		"../{app,components}/**/*.mdx",
		"../{app,components}/**/*.stories.@(js|jsx|ts|tsx)",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-themes",
		"@storybook/addon-docs",
	],
	framework: {
		name: "@storybook/nextjs-vite",
		options: {},
	},
	docs: {
		defaultName: "Documentation",
	},
	// Next.js compiles Tailwind with the Turbopack loader; Storybook runs on
	// Vite, so it adds the Tailwind Vite plugin instead.
	viteFinal: (viteConfig) => {
		viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
		return viteConfig;
	},
};

export default config;
