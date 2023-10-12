import type { Locator, Page } from "@playwright/test";

export class DiscountsPage {
  readonly page: Page;
  readonly createDiscountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createDiscountButton = page.getByTestId("create-sale");
  }
}
