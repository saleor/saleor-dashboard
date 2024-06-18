import { BasePage } from "@pages/basePage";
import { Page } from "@playwright/test";

export class OrderRefundDialog extends BasePage {
  constructor(
    page: Page,
    readonly standardRefund = page.getByTestId("standard-refund"),
    readonly manualRefund = page.getByTestId("manual-refund"),
    readonly backButton = page.getByTestId("back-button"),
    readonly proceedButton = page.getByTestId("proceed-button"),
  ) {
    super(page);
  }

  async pickLineItemsRefund() {
    await this.standardRefund.click();
    await this.proceedButton.click();
  }

  async pickManualRefund() {
    await this.manualRefund.click();
    await this.proceedButton.click();
  }
}
