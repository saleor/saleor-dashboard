import { AddressForm, customerAddress } from "@forms/addressForm";
import type { Page } from "@playwright/test";

export class AddressDialog {
  readonly addressForm: AddressForm
  constructor(
    page: Page,
    readonly newAddressRadioButton = page
      .getByTestId("newAddress")
      .locator('[value="newAddress"]'),
    readonly existingAddressRadioButton = page
      .getByTestId("customerAddress")
      .locator('[value="customerAddress"]'),

    readonly submitButton = page.getByTestId("submit"),
  ) {
    this.addressForm = new AddressForm(page)
  }

  async clickConfirmButton() {
    await this.submitButton.click();
  }
  async clickNewAddressRadioButton() {
    await this.newAddressRadioButton.click();
  }
  async completeAddressFormAllFields(customerInfo: customerAddress) {
    await this.addressForm.fillAddressFormAllFields(customerInfo)
    await this.clickConfirmButton();
    await this.submitButton.waitFor({ state: "hidden" });
  }
}
