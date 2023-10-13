import type { Locator, Page } from "@playwright/test";

export class PluginsPage {
  readonly page: Page;
  readonly pluginRow: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pluginRow = page.getByTestId("plugin");
  }
}
