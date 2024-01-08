import type { Page } from "@playwright/test";

export class PermissionGroupsPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly createPermissionGroupButton = page.getByTestId(
      "create-permission-group",
    ),
  ) {
    this.page = page;
  }
}
