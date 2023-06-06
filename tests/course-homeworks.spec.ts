import { test, expect, Locator } from "@playwright/test";
import { login } from "./utils/arranges";

test.beforeEach(async ({ page }) => {
  await login(page);
});

async function assertHomeworkProblemTable(table: Locator) {
  await expect(table.locator("tr")).toHaveCount(3);
  await expect(table.locator("th")).toHaveCount(6);
  await expect(table.locator("th")).toHaveText(["#", "PID", "Name", "Quota", "Score", "Stats"], {
    ignoreCase: true,
  });
}

test("Student can see a running homework", async ({ page }) => {
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();
  await page.getByRole("link", { name: "Homeworks" }).click();

  const card = page.locator(".card.shadow-xl > .card-body").nth(1);

  await expect(card.locator(".card-title").nth(0)).toHaveText("test RUNNING");
  await expect(card.getByText(">dayshoursminsec")).toBeVisible();

  await expect(card.locator(".card-title").nth(1)).toHaveText("Availability");
  const availabilityTable = card.locator("table").nth(0);
  await expect(availabilityTable.locator("th")).toHaveText(["From", "Due"], { ignoreCase: true });
  await expect(availabilityTable.locator("td")).toHaveText(["2020-11-28 07:14", "10000-01-01 07:59"]);

  await expect(card.locator(".card-title").nth(2)).toHaveText("Problems");
  const problemTable = card.locator("table").nth(1);
  await expect(problemTable.locator("tr")).toHaveCount(2);
  await expect(problemTable.locator("th")).toHaveCount(6);
  await expect(problemTable.locator("th")).toHaveText(["#", "PID", "Name", "Quota", "Score", "Stats"], {
    ignoreCase: true,
  });
  const PID = await problemTable.locator("td").nth(1).innerText();
  await problemTable.locator("td").nth(1).locator("a").click();
  await expect(page).toHaveURL(`/course/Test/problem/${PID}`);
  await page.goBack();
  await problemTable.locator("td").nth(5).locator("a").click();
  await expect(page).toHaveURL(`/course/Test/problem/${PID}/stats`);
  await page.goBack();

  await expect(card.locator(".card-title").nth(3)).toHaveText("Description");
  await expect(card.locator(".prose").first()).toHaveText("789");
});

test("Student can see a over homework", async ({ page }) => {
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();
  await page.getByRole("link", { name: "Homeworks" }).click();

  const card = page.locator(".card.shadow-xl > .card-body").nth(2);

  await expect(card.locator(".card-title").nth(0)).toHaveText("test2 OVER");
  await expect(card.getByText(">dayshoursminsec")).not.toBeVisible();

  await expect(card.locator(".card-title").nth(1)).toHaveText("Availability");
  const availabilityTable = card.locator("table").nth(0);
  await expect(availabilityTable.locator("th")).toHaveText(["From", "Due"], { ignoreCase: true });
  await expect(availabilityTable.locator("td")).toHaveText(["2020-11-19 23:06", "2020-11-27 21:10"]);

  await expect(card.locator(".card-title").nth(2)).toHaveText("Problems");
  const problemTable = card.locator("table").nth(1);
  await assertHomeworkProblemTable(problemTable);

  let PID = await problemTable.locator("td").nth(1).innerText();
  await problemTable.locator("td").nth(1).locator("a").click();
  await expect(page).toHaveURL(`/course/Test/problem/${PID}`);
  await page.goBack();
  await problemTable.locator("td").nth(5).locator("a").click();
  await expect(page).toHaveURL(`/course/Test/problem/${PID}/stats`);
  await page.goBack();

  await assertHomeworkProblemTable(problemTable);
  PID = await problemTable.locator("td").nth(7).innerText();
  await problemTable.locator("td").nth(7).locator("a").click();
  await expect(page).toHaveURL(`/course/Test/problem/${PID}`);
  await page.goBack();
  await problemTable.locator("td").nth(11).locator("a").click();
  await expect(page).toHaveURL(`/course/Test/problem/${PID}/stats`);
  await page.goBack();

  await expect(card.locator(".card-title").nth(3)).toHaveText("Description");
  await expect(card.locator(".prose").first()).toHaveText("test");
});

test.skip("Student should not see Create, Update, Delete button", async () => {
  // TODO
});

test.skip("Admin & Teacher can create homework", async () => {
  // TODO
});

test.skip("Admin & Teacher can update homework", async () => {
  // TODO
});

test.skip("Admin & Teacher can delete homework", async () => {
  // TODO
});

test.skip("Admin & Teacher can see Copycat link on homework card", async () => {
  // TODO
});

test.skip("Admin & Teacher can access homework stats (scoreboard)", async () => {
  // TODO
});
