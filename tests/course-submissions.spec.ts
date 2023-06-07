import { test, expect } from "@playwright/test";
import { login } from "./utils/arranges";

test.beforeEach(async ({ page }) => {
  await login(page);
});

test("Student can see submission list", async ({ page }) => {
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();
  await page.getByRole("link", { name: "Submissions" }).click();

  await expect(page.locator(".card-title").first()).toHaveText("Submissions");

  const table = await page.locator(".card table").first();
  await expect(table.locator("tr")).toHaveCount(1);
  await expect(table.locator("th")).toHaveCount(9);
  await expect(table.locator("th")).toHaveText(
    ["ID", "PID", "User", "Result", "Score", "Run Time", "Memory", "Lang", "Time"],
    { ignoreCase: true },
  );

  await expect(page.locator(".card-actions .btn")).toHaveText([" « ", "1", " » "]);
  await expect(page.locator(".card-actions .btn-disabled")).toHaveText([" « ", " » "]);
});

test("Filter by problem, status, and language", async ({ page }) => {
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();
  await page.getByRole("link", { name: "Submissions" }).click();

  await expect(page.getByText("Clear")).not.toBeVisible();

  const problem = await page.getByRole("combobox").first();
  await expect(problem.locator("option")).toHaveText(["Problem", "307 - gg", "449 - test"]);
  await problem.selectOption("449");
  await expect(page).toHaveURL("/course/Test/submissions?page=1&problemId=449");

  const status = await page.getByRole("combobox").nth(1);
  await expect(status.locator("option")).toHaveText([
    "Status",
    "Accepted",
    "Wrong Answer",
    "Compile Error",
    "Time Limit Exceed",
    "Memory Limit Exceed",
    "Runtime Error",
    "Judge Error",
    "Output Limit Exceed",
    "Pending",
  ]);
  await status.selectOption("0");
  await expect(page).toHaveURL("/course/Test/submissions?page=1&problemId=449&status=0");

  await page.getByText("Clear").click();
  await expect(page).toHaveURL(/\/course\/Test\/submissions(\?page=1)?/);
  await expect(page.getByText("Clear")).not.toBeVisible();

  const language = await page.getByRole("combobox").nth(2);
  await expect(language.locator("option")).toHaveText(["Language", "c", "cpp", "py"]);
  await language.selectOption("0");
  await expect(page).toHaveURL("/course/Test/submissions?page=1&languageType=0");
  await expect(page.getByText("Clear")).toBeVisible();
});

test.skip("Admin & Teacher can see submissions of others", async () => {
  // TODO
});
