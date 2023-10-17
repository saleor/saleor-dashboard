import type { Locator, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly sales: Locator;
  readonly orders: Locator;
  readonly activity: Locator;
  readonly topProducts: Locator;
  readonly ordersReadyToFulfill: Locator;
  readonly paymentsWaitingForCapture: Locator;
  readonly productsOutOfStock: Locator;
  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByTestId("home-header");
    this.sales = page.getByTestId("sales-analytics");
    this.orders = page.getByTestId("orders-analytics");
    this.activity = page.getByTestId("activity-card");
    this.topProducts = page.getByTestId("top-products");
    this.ordersReadyToFulfill = page.getByTestId("orders-to-fulfill");
    this.paymentsWaitingForCapture = page.getByTestId("orders-to-capture");
    this.productsOutOfStock = page.getByTestId("products-out-of-stock");
  }
  async goto() {
    await this.page.goto("/");
  }
}
