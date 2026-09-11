import { expect, test } from "../fixtures/test.js";

const cases = [
  { query: "keyboard", product: "Mechanical Keyboard" },
  { query: "audio", product: "Noise-Cancelling Headphones" },
  { query: "accessories", product: "USB-C Dock" },
];

test.describe("Product catalogue", () => {
  for (const testCase of cases) {
    test(`filters products using ${testCase.query}`, async ({
      authenticatedStore,
    }) => {
      await authenticatedStore.search.fill(testCase.query);
      await expect(authenticatedStore.products).toHaveCount(1);
      await expect(authenticatedStore.products.first()).toContainText(
        testCase.product,
      );
    });
  }

  test("catalogue adapts to a mobile viewport @responsive", async ({
    authenticatedStore,
  }) => {
    await expect(authenticatedStore.heading).toBeVisible();
    await expect(authenticatedStore.search).toBeInViewport();
  });
});
