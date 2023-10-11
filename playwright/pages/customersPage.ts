import type { Locator, Page } from "@playwright/test";

export class CustomersPage {
  readonly page: Page;
  readonly createCustomerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createCustomerButton = page.getByTestId("create-customer");
  }
}
