import { type Page } from "@playwright/test";
import { inputByTestId } from "utils/locators";

export class AddNavigationMenuDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly menuNameInput = inputByTestId(page, "menu-name-input"),
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
