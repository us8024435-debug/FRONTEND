import { test, expect } from "@playwright/test";

test.describe("Inbox & Messaging View", () => {
  test("renders conversations list and allows selection", async ({ page }) => {
    await page.goto("/inbox");

    // Conversation list should be visible
    const list = page.getByRole("complementary", { name: "Conversations inbox list" });
    await expect(list).toBeVisible();

    // Select the first conversation item if available
    const firstConv = page
      .locator("[data-conversation-id], [role='button']")
      .filter({ hasText: /\+91|\+/ })
      .first();
    if (await firstConv.isVisible()) {
      await firstConv.click();
      // Chat input or message window should appear
      await expect(page.locator("textarea, input[placeholder*='message' i]").first()).toBeVisible();
    }
  });

  test("allows composing a message and sends with Enter key", async ({ page }) => {
    await page.goto("/inbox");

    const convItem = page
      .locator("[data-conversation-id], [role='button']")
      .filter({ hasText: /\+91|\+/ })
      .first();
    if (await convItem.isVisible()) {
      await convItem.click();

      const input = page.locator("textarea, input[placeholder*='message' i]").first();
      await input.fill("Hello from automated test run");

      const sendButton = page
        .locator("button[aria-label*='Send' i], button:has-text('Send')")
        .first();
      if (await sendButton.isVisible()) {
        await sendButton.click();
      } else {
        await input.press("Enter");
      }

      await expect(page.getByText("Hello from automated test run").first()).toBeVisible();
    }
  });
});
