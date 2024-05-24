import { expect, Page } from "@playwright/test";

import { BasePage } from "../basePage";

export class AddNavigationMenuItemDialog extends BasePage {
  constructor(
    page: Page,
    readonly menuNameInput = page.getByTestId("menu-item-name-input").locator("input"),
    readonly linkSelect = page.getByTestId("container-autocomplete-select").locator("input"),
    readonly backButton = page.getByTestId("back"),
    readonly saveButton = page.getByTestId("submit"),
    readonly menuLinkOptions = page.getByTestId("menu-link-options"),
  ) {
    super(page);
  }

  async selectLinkOption(option: string, optionName: string) {
    await this.linkSelect.click();
    await this.waitForDOMToFullyLoad();
    await this.menuLinkOptions.waitFor({ state: "attached" });
    await this.menuLinkOptions
      .getByRole("option", { name: "Categories" })
      .waitFor({ state: "visible" });
    await this.menuLinkOptions
      .getByRole("option", { name: "Collections" })
      .waitFor({ state: "visible" });
    await this.menuLinkOptions.getByRole("option", { name: "Pages" }).waitFor({ state: "visible" });
    await expect(this.menuLinkOptions.getByRole("option", { name: "Categories" })).toBeEnabled();
    await this.menuLinkOptions.getByTestId(option).click();
    await this.waitForDOMToFullyLoad();
    await this.menuLinkOptions
      .getByRole("option", { name: optionName })
      .waitFor({ state: "visible" });
    expect(this.menuLinkOptions.getByRole("option", { name: optionName })).toBeEnabled();
    await this.menuLinkOptions.getByRole("option", { name: optionName }).click();
    await this.waitForDOMToFullyLoad();
    await expect(this.linkSelect).toHaveValue(optionName);
  }

  async typeMenuItemName(name: string) {
    await this.menuNameInput.fill(name);
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }
}
