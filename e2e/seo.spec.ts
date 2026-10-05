import { expect, test } from "@playwright/test";

test("homepage exposes canonical, Open Graph profile tags and one JSON-LD graph", async ({
	page,
}) => {
	await page.goto("/");

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/^https?:\/\/[^/]+\/?$/
	);
	await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
		"content",
		"profile"
	);
	await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
		"content",
		"Vernon Wee Hong KOH"
	);
	// The file-based app/opengraph-image must survive the page's openGraph.
	await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

	const jsonLd = page.locator('script[type="application/ld+json"]');
	await expect(jsonLd).toHaveCount(1);
	const data = JSON.parse((await jsonLd.textContent()) ?? "{}") as {
		"@graph"?: Array<{ "@type": string }>;
	};
	expect(data["@graph"]?.map((node) => node["@type"])).toEqual([
		"WebSite",
		"Person",
		"ProfilePage",
	]);
});

test("resume page is linked from the homepage and has its own canonical", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByRole("link", { name: "Resume", exact: true }).click();

	await expect(page).toHaveURL(/\/resume$/);
	await expect(page).toHaveTitle("Resume | Vernon Wee Hong KOH");
	await expect(
		page.getByRole("heading", { level: 1, name: /vernon wee hong koh/i })
	).toBeVisible();
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/resume$/
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		"content",
		/\/resume\/opengraph-image/
	);
});

test("serves robots.txt and a sitemap that lists the resume", async ({
	request,
}) => {
	const robotsResponse = await request.get("/robots.txt");
	expect(robotsResponse.ok()).toBe(true);

	const sitemapResponse = await request.get("/sitemap.xml");
	expect(sitemapResponse.ok()).toBe(true);
	expect(await sitemapResponse.text()).toContain("/resume</loc>");
});

test("resume has no horizontal overflow on mobile", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/resume");

	await expect(
		page.getByRole("heading", { level: 1, name: /vernon wee hong koh/i })
	).toBeVisible();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= window.innerWidth
		)
	).toBe(true);
});
