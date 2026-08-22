import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Registers @testing-library/jest-dom matchers with Vitest's `expect`.
import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

const storage = new Map<string, string>();
Object.defineProperty(window, "localStorage", {
	configurable: true,
	value: {
		getItem: (key: string): string | null => storage.get(key) ?? null,
		setItem: (key: string, value: string): void => {
			storage.set(key, value);
		},
		removeItem: (key: string): void => {
			storage.delete(key);
		},
		clear: (): void => {
			storage.clear();
		},
		key: (index: number): string | null =>
			Array.from(storage.keys())[index] ?? null,
		get length(): number {
			return storage.size;
		},
	},
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
	window.localStorage.clear();
	document.documentElement.classList.remove("dark", "light", "motion-ready");
});
