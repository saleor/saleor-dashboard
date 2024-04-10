import { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class AddNavigationMenuItemDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly menuNameInput = page
      .getByTestId("menu-item-name-input")
      .locator("input"),
    readonly linkSelect = page
      .getByTestId("container-autocomplete-select")
      .locator("input"),
    readonly backButton = page.getByTestId("back"),
    readonly saveButton = page.getByTestId("submit"),
    readonly menuLinkOptions = page.getByTestId("menu-link-options"),
  ) {
    this.page = page;
  }
  async selectLinkOption(option: string, optionName: string) {
    await this.linkSelect.click();
    await expect(this.menuLinkOptions).toBeEnabled();
    await expect(this.menuLinkOptions.getByTestId(option)).toBeEnabled({ timeout: 60000 });
    await this.menuLinkOptions.getByTestId(option).click({ force: true });
    await expect(
      this.menuLinkOptions.getByRole("option", { name: optionName }),
    ).toBeEnabled({ timeout: 60000 });
    await this.menuLinkOptions
      .getByRole("option", { name: optionName })
      .click();
  }
  async typeMenuItemName(name: string) {
    await this.menuNameInput.fill(name);
  }
  async clickSaveButton() {
    await this.saveButton.click();
  }
}
