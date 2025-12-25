import { BasePage } from "@pages/basePage";
import { expect, Page } from "@playwright/test";

export class ShippingAddressDialog extends BasePage {
  constructor(
    page: Page,
    readonly selectShippingMethodInput = page.getByTestId("shipping-method-select"),
    readonly confirmButton = page.getByTestId("confirm-button"),
    readonly backButton = page.getByTestId("back"),
    readonly shippingMethodOption = page.getByTestId("select-option"),
  ) {
    super(page);
  }

  async pickAndConfirmShippingMethod() {
    await this.selectShippingMethodInput.click();
    await this.shippingMethodOption.last().click();
    await this.confirmButton.click();
    await expect(this.selectShippingMethodInput).not.toBeVisible();
  }
}
