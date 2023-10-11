import type { Locator, Page } from "@playwright/test";

export class PermissionGroupsPage {
  readonly page: Page;
  readonly createPermissionGroupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createPermissionGroupButton = page.getByTestId(
      "create-permission-group",
    );
  }
}
