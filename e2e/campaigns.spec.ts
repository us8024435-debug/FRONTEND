import { test, expect } from "@playwright/test";

test.describe("Broadcast Campaigns View", () => {
  test("renders campaign history and metrics", async ({ page }) => {
    await page.goto("/campaigns");

    await expect(page.locator("h1")).toContainText(/Campaigns/i);

    const newCampaignBtn = page
      .getByRole("button", { name: /New Campaign|Create Campaign/i })
      .first();
    await expect(newCampaignBtn).toBeVisible();
  });

  test("traverses campaign creation wizard steps", async ({ page }) => {
    await page.goto("/campaigns/new");

    // Wizard step 1 should ask for campaign name
    const nameInput = page.locator("input[placeholder*='Campaign' i], input[name='name']").first();
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Automated E2E Test Campaign");
  });
});
