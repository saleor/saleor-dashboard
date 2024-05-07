import { BasePage } from "@pages/basePage";
import { Page } from "@playwright/test";

export class IssueGiftCardDialog extends BasePage {
  constructor(
    page: Page,
    readonly enterAmountInput = page.locator('[name="balanceAmount"]'),
    readonly expiryPeriodAmountInput = page.locator('[name="expiryPeriodAmount"]'),
    readonly tagsInput = page.getByTestId("gift-card-tag-select-field").locator("input"),
    readonly cardCode = page.getByTestId("cardCode"),

    readonly sendToCustomerCheckbox = page.getByTestId("send-to-customer-section").locator("input"),
    readonly sendExpireDateCheckbox = page.getByTestId("expiry-section").locator("input"),
    readonly customerInput = page.getByTestId("customer-field").locator("input"),
    readonly noteTextArea = page.getByTestId("note-field").locator('[name="note"]'),
    readonly requiresActivationCheckbox = page
      .getByTestId("requires-activation-section")
      .locator("input"),
    readonly issueButton = page.getByTestId("submit"),
    readonly okButton = page.getByTestId("submit"),
    readonly copyCodeButton = page.getByTestId("copy-code-button"),
  ) {
    super(page);
  }

  async clickIssueButton() {
    await this.waitForNetworkIdle(async () => {
      await this.issueButton.click();
    });
  }

  async clickOkButton() {
    await this.okButton.click();
  }

  async clickCopyCodeButton() {
    await this.copyCodeButton.click();
  }

  async typeAmount(amount: string) {
    await this.enterAmountInput.fill(amount);
  }

  async typeCustomer(customer: string) {
    await this.customerInput.fill(customer);
  }

  async typeExpiryPeriodAmount(expiryPeriodAmount: string) {
    await this.expiryPeriodAmountInput.fill(expiryPeriodAmount);
  }

  async typeTag(tag: string) {
    await this.tagsInput.fill(tag);
  }

  async typeNote(tag: string) {
    await this.noteTextArea.fill(tag);
  }

  async clickSendToCustomerCheckbox() {
    await this.sendToCustomerCheckbox.click();
  }

  async clickSendExpireDateCheckbox() {
    await this.sendExpireDateCheckbox.click();
  }

  async clickRequiresActivationCheckbox() {
    await this.requiresActivationCheckbox.click();
  }

  async getGiftCardCode() {
    const allTexts = await this.cardCode.allTextContents();

    return allTexts[0];
  }
}
