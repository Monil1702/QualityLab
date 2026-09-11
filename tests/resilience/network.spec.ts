import users from "../data/users.js";
import { expect, test } from "../fixtures/test.js";

test("catalogue displays a recoverable message when the API fails", async ({
  page,
  loginPage,
}) => {
  await page.route("**/api/products**", (route) => route.abort("failed"));
  await loginPage.goto();
  await loginPage.signIn(users.valid.email, users.valid.password);
  await expect(page.getByRole("status").first()).toHaveText(
    "Products are temporarily unavailable. Please try again.",
  );
});
