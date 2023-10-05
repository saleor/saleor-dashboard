import type { Locator, Page } from "@playwright/test";

export class DraftsPage {
  public page: Page;
  public createDraftButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createDraftButton = page.getByTestId("create-draft-order-button");
  }
}
