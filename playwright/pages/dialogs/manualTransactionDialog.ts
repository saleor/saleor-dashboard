import type { Page } from "@playwright/test";

export class ManualTransactionDialog {
  constructor(
    page: Page,
    readonly transactionDescriptionInput = page.getByTestId("transactionDescription"),
    readonly createManualTransactionButton = page.getByTestId("manualTransactionSubmit"),
    readonly transactionPspReferenceInput = page.getByTestId("transactionPspReference"),
    readonly transactAmountInput = page.getByTestId("transactAmountInput"),
  ) {}

  async clickCreateManualTransactionButton() {
    await this.createManualTransactionButton.click();
    await this.createManualTransactionButton.waitFor({ state: "hidden" });
  }

  async typeTransactionDescription(description = "partial payment") {
    await this.transactionDescriptionInput.fill(description);
  }

  async typeTransactionPspReference(reference = "999999999") {
    await this.transactionPspReferenceInput.fill(reference);
  }

  async typeTransactionAmount(amount = "100") {
    await this.transactAmountInput.fill(amount);
  }

  async completeManualTransactionDialogAndSave(
    description: string,
    reference: string,
    transactionAmount: string,
  ) {
    await this.typeTransactionDescription(description);
    await this.typeTransactionDescription(reference);
    await this.typeTransactionAmount(transactionAmount);
    await this.clickCreateManualTransactionButton();
  }
}
