import type { Locator, Page } from "@playwright/test";

export class PageTypesPage {
  readonly page: Page;
  readonly createPageTypeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createPageTypeButton = page.getByTestId("create-page-type");
  }
}
