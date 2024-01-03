import type { Locator, Page } from "@playwright/test";

export class ChannelSelectDialog {
  readonly page: Page;
  readonly allChannelsCheckbox: Locator;
  readonly displayedChannels: Locator;
  readonly confirmButton: Locator;
  readonly displayedChannelsCheckboxes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allChannelsCheckbox = page.locator("[name='allChannels']");
    this.displayedChannels = page.getByTestId("channel-row");
    this.displayedChannelsCheckboxes = page.locator("[type=checkbox]");
    this.confirmButton = page.getByTestId("submit");
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
    await this.displayedChannels
      .last()
      .locator(this.displayedChannelsCheckboxes)
      .click();
  }
  async clickConfirmButton() {
    await this.confirmButton.first().click();
  }
}
