import { Page } from "@playwright/test";

export class AddNavigationMenuDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly menuNameInput = page.getByTestId("menu-name-input").locator("input"),
    readonly saveButton = page.getByTestId("submit"),
    readonly backButton = page.getByTestId("back"),
  ) {
    this.page = page;
  }

  async typeNewMenuName(name: string) {
    await this.menuNameInput.fill(name);
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }
}
