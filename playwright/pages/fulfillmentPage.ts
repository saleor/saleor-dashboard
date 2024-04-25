import type { Page } from "@playwright/test";

export class FulfillmentPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly fulfillButton = page.getByTestId("button-bar-confirm"),
  ) {
    this.page = page;
  }

  async clickFulfillButton() {
    await this.fulfillButton.click();
  }
}
