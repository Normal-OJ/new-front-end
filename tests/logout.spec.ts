import { test, expect } from "@playwright/test";
import { login } from "./utils/arranges";

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
