import type { Locator, Page } from "@playwright/test";

export class ContentPage {
  readonly page: Page;
  readonly createContentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createContentButton = page.getByTestId("create-page");
  }
}
