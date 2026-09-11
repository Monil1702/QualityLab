import { expect, test } from "../fixtures/test.js";

test("user can add a product and place an order @smoke", async ({
  authenticatedStore,
}) => {
  await authenticatedStore.addProduct("Mechanical Keyboard");
  await expect(authenticatedStore.cartCount).toHaveText("1");
  await expect(authenticatedStore.checkout).toBeEnabled();

  await authenticatedStore.checkout.click();
  await expect(authenticatedStore.orderStatus).toContainText(
    /Order order-\d{4} confirmed — \$119\.99/,
  );
  await expect(authenticatedStore.cartCount).toHaveText("0");
  await expect(authenticatedStore.checkout).toBeDisabled();
});

test("out-of-stock product cannot be added", async ({ authenticatedStore }) => {
  const monitor = authenticatedStore.products.filter({ hasText: "4K Monitor" });
  await expect(
    monitor.getByRole("button", { name: "Out of stock" }),
  ).toBeDisabled();
});
