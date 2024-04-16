import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class DeleteDiscountDialog extends BasePage{
  constructor(
    page: Page,
    readonly deleteButton = page.getByTestId("delete-confirmation-button")

     ) {
    super(page);
  }

  async clickConfirmDeleteButton() {
    await this.deleteButton.click();
  }
}
