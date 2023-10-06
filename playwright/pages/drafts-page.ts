import type { Locator, Page } from "@playwright/test";

export class DraftsPage {
  readonly page: Page;
  readonly createDraftButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createDraftButton = page.getByTestId("create-draft-order-button");
  }
}
