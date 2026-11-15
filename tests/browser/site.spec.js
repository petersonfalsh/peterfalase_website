import { test, expect } from "@playwright/test";

test("mobile navigation opens and reaches the journey", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByText("Menu", { exact: true }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Journey" }).click();
  await expect(page).toHaveURL(/#journey$/);
  await expect(page.locator(".mobile-menu")).not.toHaveAttribute("open", "");
});

test("chat restores a failed question and retries without duplication", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/chat", async (route) => {
    calls += 1;
    await route.fulfill(calls === 1
      ? { status: 502, json: { error: "Please try again." } }
      : { status: 200, json: { message: "Peter works in digital operations.", sessionId: "a".repeat(64) } });
  });
  await page.goto("/");
  await expect(page.locator(".twin-chat-header")).toContainText("AI assistant");
  const input = page.getByRole("textbox", { name: "Ask the Digital Twin a question" });
  await input.fill("What does Peter do?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.locator(".twin-chat").getByRole("alert")).toContainText("Please try again");
  await expect(input).toHaveValue("What does Peter do?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText("Peter works in digital operations.")).toBeVisible();
  await expect(page.getByText("What does Peter do?", { exact: true })).toHaveCount(1);
});

test("chat shows readable bold text and a clear loading message", async ({ page }) => {
  let respond;
  const pending = new Promise((resolve) => { respond = resolve; });
  await page.route("**/api/chat", async (route) => {
    await pending;
    await route.fulfill({ status: 200, json: { message: "Answer", sessionId: "a".repeat(64) } });
  });
  await page.goto("/");
  await page.getByRole("textbox", { name: "Ask the Digital Twin a question" }).fill("**Hello**");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText("Thinking", { exact: true })).toBeVisible();
  const text = page.locator(".twin-message.user p");
  const colours = await text.evaluate((element) => [getComputedStyle(element).color, getComputedStyle(element.querySelector("strong")).color]);
  expect(colours[1]).toBe(colours[0]);
  respond();
  await expect(page.getByText("Answer", { exact: true })).toBeVisible();
});
