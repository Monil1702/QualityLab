import { expect, test } from "../fixtures/test.js";

const cases = [
  { query: "keyboard", product: "Mechanical Keyboard", expectedCount: 1 },
  {
    query: "audio",
    product: "Noise-Cancelling Headphones",
    expectedCount: 1,
  },
  { query: "accessories", product: "USB-C Dock", expectedCount: 2 },
];

test.describe("Product catalogue", () => {
  for (const testCase of cases) {
    test(`filters products using ${testCase.query}`, async ({
      authenticatedStore,
    }) => {
      await authenticatedStore.search.fill(testCase.query);
      await expect(authenticatedStore.products).toHaveCount(
        testCase.expectedCount,
      );
      await expect(
        authenticatedStore.products.filter({ hasText: testCase.product }),
      ).toHaveCount(1);
    });
  }

  test("catalogue adapts to a mobile viewport @responsive", async ({
    authenticatedStore,
  }) => {
    await expect(authenticatedStore.heading).toBeVisible();
    await expect(authenticatedStore.search).toBeInViewport();
  });
});
