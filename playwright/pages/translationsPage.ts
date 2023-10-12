import type { Page } from "@playwright/test";

export class TranslationsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
