import { URL_LIST } from "@data/url";
import type { Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class PermissionGroupsPage extends BasePage {
  constructor(
    page: Page,
    readonly createPermissionGroupButton = page.getByTestId("create-permission-group"),
    readonly permissionGroupsList = page.getByTestId("list"),
  ) {
    super(page);
  }

  async clickCreatePermissionGroupButton() {
    await this.createPermissionGroupButton.click();
  }

  async gotoPermissionGroupsView() {
    await this.page.goto(URL_LIST.permissionsGroups);
  }

  async gotoExistingPermissionGroupPage(id: string) {
    await this.page.goto(`${URL_LIST.permissionsGroups}${id}`);
  }
}
