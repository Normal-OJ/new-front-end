import { test, expect, Locator } from "@playwright/test";
import { login } from "./utils/arranges";

test.beforeEach(async ({ page }) => {
  await login(page);
});

async function assertProblemTable(table: Locator) {
  await expect(table.locator("tr")).toHaveCount(3);
  await expect(table.locator("th")).toHaveCount(5);
  await expect(table.locator("th")).toHaveText(["ID", "Name", "Tags", "Quota", ""], { ignoreCase: true });
}

test("Student can see problem list", async ({ page }) => {
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();
  await page.getByRole("link", { name: "Problems" }).click();

  await expect(page.locator(".card-title").first()).toHaveText("Problems");

  const table = page.locator(".card table").first();
  await assertProblemTable(table);

  let PID = await table.locator("td").nth(0).innerText();
  await table.locator("td").nth(0).locator("a").click();
  await expect(page).toHaveURL(`https://noj.tw/course/Test/problem/${PID}`);
  await page.goBack();
  await table.locator("td").nth(4).locator("a").click();
  await expect(page).toHaveURL(`https://noj.tw/course/Test/problem/${PID}/stats`);
  await page.goBack();

  await assertProblemTable(table);
  PID = await table.locator("td").nth(5).innerText();
  await table.locator("td").nth(5).locator("a").click();
  await expect(page).toHaveURL(`https://noj.tw/course/Test/problem/${PID}`);
  await page.goBack();
  await table.locator("td").nth(9).locator("a").click();
  await expect(page).toHaveURL(`https://noj.tw/course/Test/problem/${PID}/stats`);
  await page.goBack();

  await expect(page.locator(".card-actions .btn")).toHaveText([" « ", "1", " » "]);
  await expect(page.locator(".card-actions .btn-disabled")).toHaveText([" « ", " » "]);
});

test.skip("Student should not see Create, Update, Delete button", async () => {
  // TODO
});

test.skip("Admin & Teacher can create problem", async () => {
  // TODO
});

test.skip("Admin & Teacher can update problem", async () => {
  // TODO
});

test.skip("Admin & Teacher can delete problem", async () => {
  // TODO
});

test.skip("Admin & Teacher can see Status column", async () => {
  // TODO
});
