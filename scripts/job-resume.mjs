import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

// Runs job-resume.ts outside Next.js: resolves the "@/…" imports and JSX
// the way the app does.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, {
	alias: { "@": root },
	jsx: { runtime: "automatic" },
});
await jiti.import("./job-resume.ts");
