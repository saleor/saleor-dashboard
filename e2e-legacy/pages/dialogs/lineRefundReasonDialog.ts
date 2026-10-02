import type { Page } from "@playwright/test";

export class AddLineRefundReasonDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly lineRefundReasonInput = page.getByTestId("line-refund-reason-input"),
    readonly confirmButton = page.getByTestId("confirm-button"),
  ) {
    this.page = page;
  }

  async provideLineRefundReason(reason: string) {
    await this.lineRefundReasonInput.fill(reason);
  }

  async submitLineRefundReason() {
    await this.confirmButton.click();
  }
}
