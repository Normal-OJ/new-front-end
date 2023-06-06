import { expect, Page } from "@playwright/test";

export async function login(page: Page) {
  await page.goto("/");
  await page.getByPlaceholder("username or email").click();
  await page.getByPlaceholder("username or email").fill("e2e-test");
  await page.getByPlaceholder("password").click();
  await page.getByPlaceholder("password").fill("tset-e2e");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.locator(".card-title.mb-2").first()).toHaveText(/Welcome back, .*/);
}
