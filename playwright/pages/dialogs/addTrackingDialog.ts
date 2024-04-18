import type { Page } from "@playwright/test";

export class AddTrackingDialog {
  constructor(
    page: Page,
    readonly trackingNumberInput = page.getByTestId("tracking-number-input").locator("input"),
    readonly confirmTrackingNumberButton = page.getByTestId("confirm-tracking-number-button"),
  ) {}

  async typeTrackingNumber(trackingNumber = "123456789") {
    await this.trackingNumberInput.fill(trackingNumber);
  }

  async typeTrackingNumberAndSave(trackingNumber: string) {
    await this.typeTrackingNumber(trackingNumber);
    await this.confirmTrackingNumberButton.click();
    await this.confirmTrackingNumberButton.waitFor({ state: "hidden" });
  }
}
