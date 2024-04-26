import { BasePage } from "@pages/basePage";
import { Page } from "@playwright/test";

export class DeleteAddressDialog extends BasePage {
  constructor(
    page: Page,

    readonly backButton = page.getByTestId("back"),
    readonly submitButton = page.getByTestId("submit"),
  ) {
    super(page);
  }

  async clickBackButton() {
    await this.backButton.click();
  }

  async clickDeleteButton() {
    await this.waitForNetworkIdle(async () => {
      await this.submitButton.click();
    });
  }
}
