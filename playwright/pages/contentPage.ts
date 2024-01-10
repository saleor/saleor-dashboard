import type { Page } from "@playwright/test";

export class ContentPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly createContentButton = page.getByTestId("create-page"),
  ) {
    this.page = page;
  }
}
