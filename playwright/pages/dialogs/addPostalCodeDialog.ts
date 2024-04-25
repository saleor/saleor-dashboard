import { Page } from "@playwright/test";

export class AddPostalCodeDialog {
  readonly page: Page;

  constructor(
    page: Page,

    readonly zipCodeStartsWithInput = page
      .getByTestId("zip-code-starts-with-input")
      .locator("input"),
    readonly zipCodeEndsWithInput = page.getByTestId("zip-code-ends-with-input").locator("input"),
    readonly backButton = page.getByTestId("back"),
    readonly addButton = page.getByTestId("submit"),
  ) {
    this.page = page;
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
