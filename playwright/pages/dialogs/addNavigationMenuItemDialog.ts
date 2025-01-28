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

  async selectLinkTypeOption(linkType: string) {
    await this.menuLinkType.click();
    await this.waitForDOMToFullyLoad();

    // Ensure the link type option is visible and select it
    const linkTypeOption = this.menuLinkOptions.filter({ hasText: linkType });

    await linkTypeOption.waitFor({ state: "visible" });
    await expect(linkTypeOption).toBeEnabled();
    await linkTypeOption.click({ force: true });
    await linkTypeOption.waitFor({ state: "hidden" });
    await this.menuLinkValue.blur();

    // Verify the correct link type is selected
    const selectedLinkType = await this.menuLinkType.inputValue();

    if (selectedLinkType !== linkType) {
      throw new Error(`Expected link type "${linkType}" but found "${selectedLinkType}"`);
    }
  }

  async selectLinkTypeValue(optionName: string) {
    await this.menuLinkValue.fill(optionName);

    // Ensure the option is present and select it
    await this.menuLinkOptions.filter({ hasText: optionName }).waitFor({ state: "visible" });
    await this.menuLinkOptions.filter({ hasText: optionName }).click();
    await this.menuLinkOptions.waitFor({ state: "hidden" });
    await this.menuLinkValue.blur();

    // Verify the correct option is selected
    await expect(this.menuLinkValue).toHaveValue(optionName, { timeout: 5000 });
  }

  async typeMenuItemName(name: string) {
    await this.menuNameInput.fill(name);
  }

  async clickSaveButton() {
    await this.saveButton.click();
    await this.waitForDOMToFullyLoad();
  }
}
