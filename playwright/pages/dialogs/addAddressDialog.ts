import { BasePage } from "@pages/basePage";
import { AddressForm } from "@pages/forms/addressForm";
import type { Page } from "@playwright/test";

export class AddAddressDialog extends BasePage {
  readonly addressForm: AddressForm;

  constructor(
    page: Page,

    readonly backButton = page.getByTestId("back"),
    readonly submitButton = page.getByTestId("submit"),
  ) {
    super(page);
    this.addressForm = new AddressForm(page);
  }

  async clickBackButton() {
    await this.backButton.click();
  }

  async clickConfirmButton() {
    await this.waitForNetworkIdle(async () => {
      await this.submitButton.click();
    });
  }
}
