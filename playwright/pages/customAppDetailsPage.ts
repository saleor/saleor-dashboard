import { BasePage } from "@pages/basePage";
import { expect, Page } from "@playwright/test";

export class CustomAppDetailsPage extends BasePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  get manageChannelsCheckbox() {
    return this.page.getByRole("checkbox", { name: /Manage channels/i });
  }

  get customAppSaveButton() {
    return this.page.locator('[data-test-id="button-bar-confirm"]');
  }

  getAppNameHeading(appName: string) {
    return this.page.getByRole("heading", { name: appName });
  }

  async expectManageChannelsCheckboxVisible() {
    await expect(this.manageChannelsCheckbox).toBeVisible();
  }

  async expectSaveButtonVisible() {
    await expect(this.customAppSaveButton).toBeVisible();
  }

  async expectAppNameHeadingVisible(appName: string) {
    await expect(this.getAppNameHeading(appName)).toBeVisible();
  }
}
