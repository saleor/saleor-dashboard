import type { Page } from "@playwright/test";
import { inputByTestId } from "utils/locators";

export class AddTrackingDialog {
  constructor(
    page: Page,
    readonly trackingNumberInput = inputByTestId(page, "tracking-number-input"),
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
