import type { Page } from "@playwright/test";

export class ChannelSelectDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly allChannelsCheckbox = page.getByTestId("all-channels"),
    readonly displayedChannels = page.getByTestId("channel-row"),
    readonly displayedChannelsCheckboxes = page.locator('button[role="checkbox"]'),
    readonly confirmButton = page.getByTestId("submit"),
  ) {
    this.page = page;
  }

  async clickAllChannelsCheckbox() {
    await this.allChannelsCheckbox.click();
  }

  async selectChannel(channelName: string) {
    await this.displayedChannels
      .filter({ hasText: channelName })
      .locator(this.displayedChannelsCheckboxes)
      .click();
  }

  async selectLastChannel() {
    await this.displayedChannels.last().locator(this.displayedChannelsCheckboxes).click();
  }

  async clickConfirmButton() {
    await this.confirmButton.first().click();
  }
}
