import { expect, type Locator, type Page } from "@playwright/test";

export class StorePage {
  readonly heading: Locator;
  readonly search: Locator;
  readonly products: Locator;
  readonly cartCount: Locator;
  readonly checkout: Locator;
  readonly orderStatus: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", {
      name: "Find your workspace essentials",
    });
    this.search = page.getByLabel("Search products");
    this.products = page.locator(".product");
    this.cartCount = page.locator("#cart-count");
    this.checkout = page.getByRole("button", { name: "Place order" });
    this.orderStatus = page.locator("#order-status");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.page.getByRole("status").first()).toContainText(
      "products found",
    );
  }

  async addProduct(name: string): Promise<void> {
    await this.page
      .getByRole("button", { name: `Add ${name} to cart` })
      .click();
  }
}
