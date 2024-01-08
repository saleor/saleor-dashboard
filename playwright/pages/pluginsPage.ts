import type { Page } from "@playwright/test";

export class PluginsPage {
  readonly page: Page;

  constructor(page: Page, readonly pluginRow = page.getByTestId("plugin")) {
    this.page = page;
  }
}
