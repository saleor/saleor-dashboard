import type { Locator, Page } from "@playwright/test";

export class DiscountsPage {
  public page: Page;
  public createDiscountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createDiscountButton = page.getByTestId("create-sale");
  }
}
