import { test, expect, Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("https://noj.tw/");
  await page.getByPlaceholder("username or email").click();
  await page.getByPlaceholder("username or email").fill("e2e-test");
  await page.getByPlaceholder("password").click();
  await page.getByPlaceholder("password").fill("tset-e2e");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.locator(".card-title.mb-2").first()).toHaveText(/Welcome back, .*/);
}

test.beforeEach(async ({ page }) => {
  await login(page);
});

test("successful logout by visiting profile page", async ({ page }) => {
  await page.goto("https://noj.tw/profile");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.locator(".card-title.mb-2").first()).toHaveText("Sign in");
  expect(page.url()).toBe("https://noj.tw/");
});

test("successful logout by clicking profile link", async ({ page }) => {
  await page.getByRole("link", { name: "Profile" }).click();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.locator(".card-title.mb-2").first()).toHaveText("Sign in");
  expect(page.url()).toBe("https://noj.tw/");
});
