import { test as base, expect } from "@playwright/test";

import users from "../data/users.js";
import { LoginPage } from "../pages/login.page.js";
import { StorePage } from "../pages/store.page.js";

type Fixtures = {
  loginPage: LoginPage;
  storePage: StorePage;
  authenticatedStore: StorePage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  storePage: async ({ page }, use) => {
    await use(new StorePage(page));
  },
  authenticatedStore: async ({ loginPage, storePage }, use) => {
    await loginPage.goto();
    await loginPage.signIn(users.valid.email, users.valid.password);
    await storePage.expectLoaded();
    await use(storePage);
  },
});

export { expect };
