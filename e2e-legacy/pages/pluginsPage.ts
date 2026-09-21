import type { Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class PluginsPage extends BasePage {
  constructor(
    page: Page,
    readonly pluginRow = page.getByTestId("plugin"),
  ) {
    super(page);
  }
}
