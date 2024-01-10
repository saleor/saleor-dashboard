import type { Page } from "@playwright/test";

export class WebhooksEventsPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly createAppButton = page.getByTestId("create-app"),
  ) {
    this.page = page;
  }
}
