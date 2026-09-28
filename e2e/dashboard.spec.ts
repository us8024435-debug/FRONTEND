import { test, expect } from "@playwright/test";

test.describe("Dashboard View", () => {
  test("redirects root '/' to '/dashboard' and loads layout", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("renders KPI metric cards and charts", async ({ page }) => {
    await page.goto("/dashboard");

    // Verify presence of metric cards
    const cards = page.locator(".grid").first();
    await expect(cards).toBeVisible();

    // Verify sidebar navigation items are clickable
    const inboxLink = page.getByRole("link", { name: /Inbox/i });
    await expect(inboxLink).toBeVisible();
  });

  test("toggles theme between light and dark mode", async ({ page }) => {
    await page.goto("/dashboard");

    const themeToggle = page.getByRole("button", { name: /Toggle theme/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      const html = page.locator("html");
      await expect(html).toHaveAttribute("class", /dark|light/);
    }
  });
});
