import type { Locator, Page } from "@playwright/test";

export class AddressDialog {
  readonly page: Page;
  readonly existingAddressRadioButton: Locator;
  readonly newAddressRadioButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newAddressRadioButton = page
      .getByTestId("newAddress")
      .locator('[value="newAddress"]');
    this.existingAddressRadioButton = page
      .getByTestId("customerAddress")
      .locator('[value="customerAddress"]');

    this.submitButton = page.getByTestId("submit");
  }

  async clickConfirmButton() {
    await this.submitButton.click();
  }
}
