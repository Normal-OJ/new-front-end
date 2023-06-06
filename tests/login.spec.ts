import { test, expect } from "@playwright/test";
import { login } from "./utils/arranges";

test("successful login with username", async ({ page }) => {
  await login(page);
});

test("successful login with email", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("username or email").click();
  await page.getByPlaceholder("username or email").fill("test@e2e.noj.tw");
  await page.getByPlaceholder("password").click();
  await page.getByPlaceholder("password").fill("tset-e2e");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.locator(".card-title.mb-2").first()).toHaveText(/Welcome back, .*/);
});

test("successful login with using enter shortcut to submit", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("username or email").click();
  await page.getByPlaceholder("username or email").fill("test@e2e.noj.tw");
  await page.getByPlaceholder("password").click();
  await page.getByPlaceholder("password").fill("tset-e2e");
  await page.getByPlaceholder("password").press("Enter");
  await expect(page.locator(".card-title.mb-2").first()).toHaveText(/Welcome back, .*/);
});

test("failed login with incorrect username", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("username or email").click();
  await page.getByPlaceholder("username or email").fill("e2e-test-bad");
  await page.getByPlaceholder("password").click();
  await page.getByPlaceholder("password").fill("tset-e2e");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.locator(".alert.alert-error").first()).toHaveText(
    "Login Failed: Your username/email or password is incorrect.",
  );
});

test("failed login with incorrect password", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("username or email").click();
  await page.getByPlaceholder("username or email").fill("e2e-test");
  await page.getByPlaceholder("password").click();
  await page.getByPlaceholder("password").fill("tset-e2e-bad");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.locator(".alert.alert-error").first()).toHaveText(
    "Login Failed: Your username/email or password is incorrect.",
  );
});
