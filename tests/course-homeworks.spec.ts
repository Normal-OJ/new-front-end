import { test, expect } from "@playwright/test";
import { login } from "./utils/arranges";

test.beforeEach(async ({ page }) => {
  await login(page);
});

test("Read a running homework", async ({ page }) => {
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();
  await page.getByRole("link", { name: "Homeworks" }).click();

  const card = page.locator(".card.shadow-xl > .card-body").nth(1);

  await expect(card.locator(".card-title").nth(0)).toHaveText("test RUNNING");
  await expect(card.getByText(">dayshoursminsec")).toBeVisible();

  await expect(card.locator(".card-title").nth(1)).toHaveText("Availability");
  const availabilityTable = card.locator("table").nth(0);
  await expect(availabilityTable.locator("th")).toHaveText(["From", "Due"]);
  await expect(availabilityTable.locator("td")).toHaveText(["2020-11-28 07:14", "10000-01-01 07:59"]);

  await expect(card.locator(".card-title").nth(2)).toHaveText("Problems");
  const problemTable = card.locator("table").nth(1);
  expect(problemTable.locator("tr")).toHaveCount(2);
  expect(problemTable.locator("th")).toHaveCount(6);
  await expect(problemTable.locator("th")).toHaveText(["#", "PID", "Name", "Quota", "Score", "Stats"]);
  const PID = await problemTable.locator("td").nth(1).innerText();
  await problemTable.locator("td").nth(1).locator("a").click();
  await expect(page).toHaveURL(`https://noj.tw/course/Test/problem/${PID}`);
  await page.goBack();
  await problemTable.locator("td").nth(5).locator("a").click();
  await expect(page).toHaveURL(`https://noj.tw/course/Test/problem/${PID}/stats`);
  await page.goBack();

  await expect(card.locator(".card-title").nth(3)).toHaveText("Description");
  await expect(card.locator(".prose").first()).toHaveText("789");
});

test("Read a over homework", async ({ page }) => {
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();
  await page.getByRole("link", { name: "Homeworks" }).click();

  const card = page.locator(".card.shadow-xl > .card-body").nth(2);

  await expect(card.locator(".card-title").nth(0)).toHaveText("test2 OVER");
  await expect(card.getByText(">dayshoursminsec")).not.toBeVisible();

  await expect(card.locator(".card-title").nth(1)).toHaveText("Availability");
  const availabilityTable = card.locator("table").nth(0);
  await expect(availabilityTable.locator("th")).toHaveText(["From", "Due"]);
  await expect(availabilityTable.locator("td")).toHaveText(["2020-11-19 23:06", "2020-11-27 21:10"]);

  await expect(card.locator(".card-title").nth(2)).toHaveText("Problems");
  const problemTable = card.locator("table").nth(1);
  expect(problemTable.locator("tr")).toHaveCount(3);
  expect(problemTable.locator("th")).toHaveCount(6);
  await expect(problemTable.locator("th")).toHaveText(["#", "PID", "Name", "Quota", "Score", "Stats"]);

  let PID = await problemTable.locator("td").nth(1).innerText();
  await problemTable.locator("td").nth(1).locator("a").click();
  await expect(page).toHaveURL(`https://noj.tw/course/Test/problem/${PID}`);
  await page.goBack();
  await problemTable.locator("td").nth(5).locator("a").click();
  await expect(page).toHaveURL(`https://noj.tw/course/Test/problem/${PID}/stats`);
  await page.goBack();

  PID = await problemTable.locator("td").nth(7).innerText();
  await problemTable.locator("td").nth(7).locator("a").click();
  await expect(page).toHaveURL(`https://noj.tw/course/Test/problem/${PID}`);
  await page.goBack();
  await problemTable.locator("td").nth(11).locator("a").click();
  await expect(page).toHaveURL(`https://noj.tw/course/Test/problem/${PID}/stats`);
  await page.goBack();

  await expect(card.locator(".card-title").nth(3)).toHaveText("Description");
  await expect(card.locator(".prose").first()).toHaveText("test");
});

test.skip("Create homework in 'Test' course", async () => {
  // TODO
});

test.skip("Update homework in 'Test' course", async () => {
  // TODO
});

test.skip("Delete homework in 'Test' course", async () => {
  // TODO
});

test.skip("Copycat link does exist on homework card", async () => {
  // TODO
});

test.skip("Access homework stats (scoreboard)", async () => {
  // TODO
});
