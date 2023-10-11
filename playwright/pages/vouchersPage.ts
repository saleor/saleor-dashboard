import type { Locator, Page } from "@playwright/test";

export class VouchersPage {
  readonly page: Page;
  readonly createVoucherButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createVoucherButton = page.getByTestId("create-voucher");
  }
}
