import { expect, test } from "@playwright/test";

test("renders the portfolio and navigates to contact", async ({ page }) => {
	await page.goto("/");
	await expect(
		page.getByRole("heading", { level: 1, name: /vernon wee hong koh/i })
	).toBeVisible();
	await expect(
		page.getByText("Backend Engineer", { exact: true })
	).toBeVisible();

	await page.getByRole("link", { name: "Get in touch" }).click();
	await expect(page.locator("#contact")).toBeInViewport();
	await expect(page.getByLabel("Email")).toBeVisible();
});

test("persists dark mode", async ({ page }) => {
	await page.goto("/");
	const toggle = page.getByRole("button", { name: "Toggle dark mode" });
	await toggle.click();
	await expect(page.locator("html")).toHaveClass(/dark/);

	await page.reload();
	await expect(page.locator("html")).toHaveClass(/dark/);
});

test("uses the first animated card as the minimum height", async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto("/");

	await Promise.all(
		["#experience", "#projects"].map(async (stack) =>
			expect
			.poll(async () => {
				const heights = await page
					.locator(`${stack} .card`)
					.evaluateAll((cards) =>
						cards.map((card) => card.getBoundingClientRect().height)
					);
				const [firstHeight = 0, ...remainingHeights] = heights;
				return remainingHeights.every((height) => height >= firstHeight);
			})
			.toBe(true)
		)
	);
});

test("remains usable without horizontal overflow on mobile", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");

	await expect(
		page.getByRole("heading", { level: 1, name: /vernon wee hong koh/i })
	).toBeVisible();
	await expect(
		page.getByRole("navigation", { name: "Portfolio sections" })
	).toBeHidden();
	await expect(page.locator("#contact")).toBeAttached();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= window.innerWidth
		)
	).toBe(true);
});
