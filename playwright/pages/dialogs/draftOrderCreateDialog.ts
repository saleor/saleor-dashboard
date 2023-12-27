import type { Locator, Page } from "@playwright/test";

export class DraftOrderCreateDialog {
  readonly page: Page;
  readonly channelNameInput: Locator;
  readonly channelOption: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.channelNameInput = page.getByTestId("channel-autocomplete");
    this.confirmButton = page.getByTestId("submit");
    this.channelOption = page.locator("[data-test-id*='select-field-option']");
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
