import type { Locator, Page } from "@playwright/test";

export class OrdersPage {
  public page: Page;
  public createOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createOrderButton = page.getByTestId("create-order-button");
  }
}
