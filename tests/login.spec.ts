import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/dashboard");
  await page.fill('[data-test-id="email"]', process.env.CYPRESS_USER_NAME!);
  await page.fill(
    '[data-test-id="password"]',
    process.env.CYPRESS_USER_PASSWORD!,
  );
  await page.click('[data-test-id="submit"]');

  await expect(page).toHaveTitle("Dashboard | Saleor e-commerce");
});
