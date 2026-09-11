import users from "../data/users.js";
import { expect, test } from "../fixtures/test.js";

test.describe("Authentication", () => {
  test("valid user can sign in @smoke", async ({ loginPage, storePage }) => {
    await loginPage.goto();
    await loginPage.signIn(users.valid.email, users.valid.password);
    await storePage.expectLoaded();
  });

  test("invalid credentials show a useful error", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.signIn(users.invalid.email, users.invalid.password);
    await expect(loginPage.error).toHaveText("Email or password is incorrect");
  });
});
