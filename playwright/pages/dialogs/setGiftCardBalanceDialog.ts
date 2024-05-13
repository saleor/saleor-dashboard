import { Page } from "@playwright/test";

export class SetGiftCardsBalanceDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly submitButton = page.getByTestId("submit"),
    readonly enterAmountInput = page.locator('[name="balanceAmount"]'),
  ) {
    this.page = page;
  }

  async setBalance(balance: string) {
    await this.enterAmountInput.fill(balance);
    await this.submitButton.click();
  }
}
