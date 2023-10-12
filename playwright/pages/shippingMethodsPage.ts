import type { Locator, Page } from "@playwright/test";

export class ShippingMethodsPage {
  readonly page: Page;
  readonly createShippingZoneButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createShippingZoneButton = page.getByTestId("add-shipping-zone");
  }
}
