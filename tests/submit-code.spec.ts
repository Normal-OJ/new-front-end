import { test, expect } from "@playwright/test";
import { login } from "./utils/arranges";

test("submit code to A+B problem and get AC", async ({ page }) => {
  await page.goto("/");
  await login(page);
  await page.getByRole("link", { name: "Course" }).click();
  await page.getByRole("link", { name: "Test" }).click();
  await page.getByRole("link", { name: "Problems" }).click();
  await page.getByRole("link", { name: "510" }).click();
  await page.getByRole("link", { name: "Submit" }).click();
  await page.getByTestId("textarea").click();
  await page.getByTestId("textarea").fill("asdfasdf");
  await page.getByRole("combobox").selectOption("1");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page).toHaveURL(/\/course\/Test\/submission\/[a-e\d]+/);

  const generalResult = await page.locator("table").nth(0);
  await expect(generalResult.locator("td").nth(2)).toHaveText("Accepted", {
    timeout: 30000,
  });
});
