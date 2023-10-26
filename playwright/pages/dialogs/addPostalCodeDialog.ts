import { Locator, Page } from "@playwright/test";

export class AddPostalCodeDialog {
  readonly page: Page;

  readonly zipCodeStartsWithInput: Locator;
  readonly zipCodeEndsWithInput: Locator;
  readonly backButton: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.zipCodeStartsWithInput = page
      .getByTestId("zip-code-starts-with-input")
      .locator("input");
    this.zipCodeEndsWithInput = page
      .getByTestId("zip-code-ends-with-input")
      .locator("input");
    this.backButton = page.getByTestId("back");
    this.addButton = page.getByTestId("submit");
  }

  async addStartAndEndZipCodesRange(startsWith = "10", endsWith = "09") {
    await this.zipCodeStartsWithInput.fill(startsWith);
    await this.zipCodeEndsWithInput.fill(endsWith);
    await this.addButton.click();
    await this.zipCodeStartsWithInput.waitFor({
      state: "hidden",
      timeout: 5000,
    });
  }
}
