import type { Page } from "@playwright/test";

export class DraftOrderCreateDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly channelNameInput = page.getByTestId("channel-autocomplete"),
    readonly confirmButton = page.getByTestId("submit"),
    readonly channelOption = page.locator("[data-test-id*='select-field-option']"),
  ) {
    this.page = page;
  }

  async expandChannelsSearchList() {
    await this.channelNameInput.click();
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
  }

  async completeDraftOrderCreateDialogWithFirstChannel() {
    await this.expandChannelsSearchList();
    await this.channelOption.first().click();
    await this.clickConfirmButton();
  }
}
