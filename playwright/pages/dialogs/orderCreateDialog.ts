import type { Page } from "@playwright/test";

export class OrderCreateDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly channelNameInput = page.getByTestId("channel-autocomplete"),
    readonly confirmButton = page.getByTestId("submit"),
    readonly channelOption = page.getByTestId("select-option"),
  ) {
    this.page = page;
  }

  async expandChannelsSearchList() {
    await this.channelNameInput.click();
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
  }

  async completeOrderCreateDialogWithFirstChannel() {
    await this.expandChannelsSearchList();
    await this.channelOption.first().click();
    await this.clickConfirmButton();
  }

  async completeOrderCreateDialogWithTransactionChannel() {
    await this.expandChannelsSearchList();
    await this.channelOption.filter({ hasText: "transaction flow channel" }).click();
    await this.clickConfirmButton();
  }
}
