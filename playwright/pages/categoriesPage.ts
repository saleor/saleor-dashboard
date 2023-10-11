import type { Locator, Page } from "@playwright/test";

export class CategoriesPage {
  readonly page: Page;
  readonly createCategoryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createCategoryButton = page.getByTestId("create-category");
  }
}
