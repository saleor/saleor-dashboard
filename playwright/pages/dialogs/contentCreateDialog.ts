import type { Page } from "@playwright/test";

export class ContentCreateDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly pageTypeInput = page.getByTestId("dialog-page-type"),
    readonly confirmButton = page.getByTestId("confirm-button"),
    readonly channelOption = page.locator(
      "[data-test-id*='option'][data-test-id*='select']",
    ),
  ) {
    this.page = page;
  }

  async expandPageTypeList() {
    await this.pageTypeInput.click({ force: true });
  }
  async clickConfirmButton() {
    await this.confirmButton.click();
  }

  async completeContentCreateDialogWithFirstPageType() {
    await this.expandPageTypeList();
    await this.channelOption.first().click();
    await this.clickConfirmButton();
  }
}
