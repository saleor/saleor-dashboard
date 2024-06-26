import { BasePage } from "@pages/basePage";
import { expect, Page } from "@playwright/test";

export class ShippingAddressDialog extends BasePage {
  constructor(
    page: Page,
    readonly selectShippingMethodInput = page.locator(
      '[id="mui-component-select-shippingMethod"]',
    ),
    readonly confirmButton = page.getByTestId("confirm-button"),
    readonly backButton = page.getByTestId("back"),
    readonly shippingMethodOption = page.locator(
      "[data-test-id*='select-field-option']",
    ),
  ) {
    super(page);
  }

  async pickAndConfirmFirstShippingMethod() {
    await this.selectShippingMethodInput.click();
    await this.shippingMethodOption.first().click();
    await this.confirmButton.click();
    await expect(this.selectShippingMethodInput).not.toBeVisible();
  }
}
