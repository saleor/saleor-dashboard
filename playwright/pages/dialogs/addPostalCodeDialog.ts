import { type Page } from "@playwright/test";
import { inputByTestId } from "utils/locators";

export class AddPostalCodeDialog {
  readonly page: Page;

  constructor(
    page: Page,

    readonly zipCodeStartsWithInput = inputByTestId(page, "zip-code-starts-with-input"),
    readonly zipCodeEndsWithInput = inputByTestId(page, "zip-code-ends-with-input"),
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
