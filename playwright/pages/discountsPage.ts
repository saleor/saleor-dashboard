import type { Page } from "@playwright/test";

export class DiscountsPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly createDiscountButton = page.getByTestId("create-sale"),
  ) {
    this.page = page;
  }
}
