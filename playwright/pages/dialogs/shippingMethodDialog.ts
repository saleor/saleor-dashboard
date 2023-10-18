import { expect, Locator, Page } from "@playwright/test";

export class ShippingAddressDialog {
  readonly page: Page;

  readonly selectShippingMethodInput: Locator;
  readonly confirmButton: Locator;
  readonly backButton: Locator;
  readonly shippingMethodOption: Locator;

  constructor(page: Page) {
    this.page = page;

    this.selectShippingMethodInput = page.locator(
      '[id="mui-component-select-shippingMethod"]',
    );
    this.confirmButton = page.getByTestId("confirm-button");
    this.backButton = page.getByTestId("back");
    this.shippingMethodOption = page.locator(
      "[data-test-id*='select-field-option']",
    );
  }

  async pickAndConfirmFirstShippingMethod() {
    await this.selectShippingMethodInput.click();
    await this.shippingMethodOption.first().click();
    await this.confirmButton.click();
    await expect(this.selectShippingMethodInput).not.toBeVisible();
  }
}
