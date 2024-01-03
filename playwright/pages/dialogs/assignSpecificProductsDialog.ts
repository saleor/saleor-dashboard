import type { Page } from "@playwright/test";

export class AssignSpecificProductsDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly nameInput = page.getByTestId("value-name").locator("input"),
    readonly assignAndSaveButton = page.locator("button[type='submit']"),
  ) {
    this.page = page;
  }

  async clickAssignAndSaveButton() {
    await this.assignAndSaveButton.click();
    await this.assignAndSaveButton.waitFor({ state: "hidden" });
  }

  async assignSpecificProductsByNameAndSave(nameAkaText: string) {
    const specificProductCheckbox = await this.page
      .getByRole("row", { name: nameAkaText })
      .getByRole("checkbox");
    await specificProductCheckbox.click();
    await this.clickAssignAndSaveButton();
    await this.assignAndSaveButton.waitFor({ state: "hidden" });
  }
}
