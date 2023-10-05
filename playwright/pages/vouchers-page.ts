import type { Locator, Page } from "@playwright/test";

export class VouchersPage {
  public page: Page;
  public createVoucherButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createVoucherButton = page.getByTestId("create-voucher");
  }
}
