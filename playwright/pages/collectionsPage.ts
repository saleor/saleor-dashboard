import type { Locator, Page } from "@playwright/test";

export class CollectionsPage {
  readonly page: Page;
  readonly createCollectionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createCollectionButton = page.getByTestId("create-collection");
  }
}
