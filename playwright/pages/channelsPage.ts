import type { Locator, Page } from "@playwright/test";

export class ChannelPage {
  readonly page: Page;
  readonly createChannelButton: Locator;
  readonly deleteChannelButton: Locator;
  readonly channelsListTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deleteChannelButton = page.getByTestId("delete-channel");
    this.createChannelButton = page.getByTestId("add-channel");
    this.channelsListTable = page.getByTestId("channel-list");
  }
}
