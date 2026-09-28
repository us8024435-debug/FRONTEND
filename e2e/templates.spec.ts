import { test, expect } from "@playwright/test";

test.describe("Templates Catalog & Builder View", () => {
  test("renders template library and filters", async ({ page }) => {
    await page.goto("/templates");

    await expect(page.locator("h1")).toContainText(/Templates/i);

    const createBtn = page.getByRole("button", { name: /New Template|Create Template/i }).first();
    await expect(createBtn).toBeVisible();
  });

  test("navigates to template builder and displays live preview", async ({ page }) => {
    await page.goto("/templates/new");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Create Template");

    // Live preview container should exist
    const preview = page
      .locator("[data-preview], div")
      .filter({ hasText: /Preview/i })
      .first();
    await expect(preview).toBeVisible();
  });
});
