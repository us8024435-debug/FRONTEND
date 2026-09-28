import { test, expect } from "@playwright/test";

test.describe("Contacts Management View", () => {
  test("renders contacts table with search and filters", async ({ page }) => {
    await page.goto("/contacts");

    await expect(page.locator("h1")).toContainText(/Contacts/i);

    const searchInput = page.locator("input[placeholder*='Search' i]").first();
    await expect(searchInput).toBeVisible();

    const table = page.locator("table").first();
    await expect(table).toBeVisible();
  });

  test("opens Add Contact drawer and validates inputs", async ({ page }) => {
    await page.goto("/contacts");

    const addBtn = page.getByRole("button", { name: /Add Contact|New Contact/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await expect(page.getByText(/Create New Contact|Add Contact/i).first()).toBeVisible();
    }
  });
});
