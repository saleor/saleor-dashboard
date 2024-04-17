import { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../basePage";

export class AddNavigationMenuItemDialog extends BasePage{

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
    super(page)
  }
  async selectLinkOption(option: string, optionName: string) {
    await this.linkSelect.fill(optionName);
    await expect(this.menuLinkOptions.getByTestId(option)).toBeEnabled({ timeout: 60000 });
    await this.page.getByTestId(option).click({force: true});
    await this.menuLinkOptions.getByText(optionName).click({force: true})
  }
  async typeMenuItemName(name: string) {
    await this.menuNameInput.fill(name);
  }
  async clickSaveButton() {
    await this.saveButton.click();
  }
}
