import type { Page } from "@playwright/test";

export class CollectionsPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly createCollectionButton = page.getByTestId("create-collection"),
  ) {
    this.page = page;
  }
}
