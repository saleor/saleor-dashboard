import { expect, Page } from "@playwright/test";

import { BasePage } from "../basePage";

export class AddNavigationMenuItemDialog extends BasePage {
  constructor(
    page: Page,
    readonly menuNameInput = page.getByTestId("menu-item-name-input"),
    readonly menuLinkType = page.getByTestId("menu-item-link-type-input"),
    readonly menuLinkValue = page.getByTestId("menu-item-link-value-input"),
    readonly saveButton = page.getByTestId("submit"),
    readonly menuLinkOptions = page.getByTestId("select-option"),
  ) {
    super(page);
  }

  async selectLinkOption(option: string, optionName: string) {
    await this.menuLinkType.click();
    await this.waitForDOMToFullyLoad();
    await this.menuLinkOptions.filter({ hasText: "Categories" }).waitFor({ state: "visible" });
    await this.menuLinkOptions.filter({ hasText: "Collections" }).waitFor({ state: "visible" });
    await this.menuLinkOptions.filter({ hasText: "Pages" }).waitFor({ state: "visible" });
    await expect(this.menuLinkOptions.filter({ hasText: option })).toBeEnabled();
    await this.menuLinkOptions.filter({ hasText: option }).click({ force: true });
    await this.waitForDOMToFullyLoad();
    await this.menuLinkValue.click();
    await this.menuLinkOptions.filter({ hasText: optionName }).waitFor({ state: "visible" });
    await expect(this.menuLinkOptions.filter({ hasText: optionName })).toBeEnabled();
    await this.menuLinkOptions.filter({ hasText: optionName }).click({ force: true });
    await this.waitForDOMToFullyLoad();
    await expect(this.menuLinkValue).toHaveValue(optionName);
  }

  async typeMenuItemName(name: string) {
    await this.menuNameInput.fill(name);
  }

  async clickSaveButton() {
    await this.saveButton.click();
    await this.waitForDOMToFullyLoad();
  }
}
