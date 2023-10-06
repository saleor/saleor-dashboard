import type { Locator, Page } from "@playwright/test";

export class WebhooksEventsPage {
  readonly page: Page;
  readonly createAppButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createAppButton = page.getByTestId("create-app");
  }
}
