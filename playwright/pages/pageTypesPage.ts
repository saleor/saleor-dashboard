import type { Page } from "@playwright/test";

export class PageTypesPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly createPageTypeButton = page.getByTestId("create-page-type"),
  ) {
    this.page = page;
  }
}
