import { test, expect, Page } from "@playwright/test";
import { login } from "./utils/arranges";

test.beforeEach(async ({ page }) => {
  await login(page);
});

async function assertAnnouncementsList(page: Page) {
  await expect(page.locator(".card-title").first()).toHaveText("Announcements");

  const table = await page.locator(".card table").first();
  await expect(table.locator("tr")).toHaveCount(6);
  await expect(table.locator("th")).toHaveCount(3);
  await expect(table.locator("th")).toHaveText(["Title", "Author", "Create At"], { ignoreCase: true });
  await expect(table.locator("tbody tr").first().locator("td")).toHaveText([
    "測試、測試",
    "bogay",
    "2023-01-08 03:01",
  ]);
}

async function assertAnnouncementPage(page: Page) {
  await expect(page.getByText("測試、測試")).toBeVisible();
  await expect(page.getByText("Markdown aaa bbb ccc katex\\text{katex}katex are supported.")).toBeVisible();
  await expect(page.getByText("Last updated: 2023-01-08 03:01")).toBeVisible();
  await expect(page.getByText("Posted by bogay at 2023-01-08 03:01")).toBeVisible();
}

test("Student can see announcements", async ({ page }) => {
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();

  await assertAnnouncementsList(page);

  await page.getByRole("link", { name: "測試、測試" }).click();

  await assertAnnouncementPage(page);
});

test("User can interact with Breadcrumbs", async ({ page }) => {
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();
  await page.getByRole("link", { name: "測試、測試" }).click();
  await assertAnnouncementPage(page);

  await expect(page.locator(".breadcrumbs > ul > li").nth(0)).toHaveText("Test");
  await page.locator(".breadcrumbs > ul > li").nth(0).click();
  await assertAnnouncementsList(page);
  await page.goBack();

  await expect(page.locator(".breadcrumbs > ul > li").nth(1)).toHaveText("Announcements");
  await page.locator(".breadcrumbs > ul > li").nth(1).click();
  await assertAnnouncementsList(page);
  await page.goBack();

  await expect(page.locator(".breadcrumbs > ul > li").nth(2)).toHaveText(/[\da-z]{24}/);
  const announcementId = page.url().split("/").at(-1) as string;
  await expect(page.locator(".breadcrumbs > ul > li").nth(2)).toHaveText(announcementId);
});

test.skip("Student should not see Create, Update, Delete button", async () => {
  // TODO
});

test.skip("Admin & Teacher can create announcement", async () => {
  // TODO
});

test.skip("Admin & Teacher can update announcement", async () => {
  // TODO
});

test.skip("Admin & Teacher can delete announcement", async () => {
  // TODO
});
