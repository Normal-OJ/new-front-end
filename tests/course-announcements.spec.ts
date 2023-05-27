import { test, expect, Page } from "@playwright/test";
import { login } from "./utils/arranges";

test.beforeEach(async ({ page }) => {
  await login(page);
});

async function assertAnnouncementsList(page: Page) {
  await expect(page.locator(".card-title").first()).toHaveText("Announcements");

  await expect(page.getByRole("cell", { name: "Title" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Author" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Create At" })).toBeVisible();

  await expect(page.getByRole("cell", { name: "測試、測試" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "bogay" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "2023-01-08 03:01" })).toBeVisible();
}

async function assertAnnouncementPage(page: Page) {
  await expect(page.getByText("測試、測試")).toBeVisible();
  await expect(page.getByText("Markdown aaa bbb ccc katex\\text{katex}katex are supported.")).toBeVisible();
  await expect(page.getByText("Last updated: 2023-01-08 03:01")).toBeVisible();
  await expect(page.getByText("Posted by bogay at 2023-01-08 03:01")).toBeVisible();
}

test("Read announcement in 'Test' course", async ({ page }) => {
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();

  await assertAnnouncementsList(page);

  await page.getByRole("link", { name: "測試、測試" }).click();

  await assertAnnouncementPage(page);
});

test("Breadcrumbs in course announcement page", async ({ page }) => {
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
