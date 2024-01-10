import type { Page } from "@playwright/test";

export class CustomersPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly createCustomerButton = page.getByTestId("create-customer"),
  ) {
    this.page = page;
  }
}
