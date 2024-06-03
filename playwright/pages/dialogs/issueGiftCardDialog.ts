import { BasePage } from "@pages/basePage";
import { expect, Page } from "@playwright/test";

export class IssueGiftCardDialog extends BasePage {
  constructor(
    page: Page,
    readonly enterAmountInput = page.locator('[name="balanceAmount"]'),
    readonly expiryPeriodAmountInput = page.locator('[name="expiryPeriodAmount"]'),
    readonly tagsInput = page.getByTestId("gift-card-tag-select-field").locator("input"),
    readonly cardCode = page.getByTestId("cardCode"),
    readonly giftCardExpireFields = page.getByTestId("gift-card-expire-data-fields"),
    readonly sendToCustomerCheckbox = page
      .getByTestId("send-to-customer-section")
      .locator('input[type="checkbox"]'),
    readonly sendExpireDateCheckbox = page.getByTestId("expiry-section").locator("input"),
    readonly customerInput = page.getByTestId("customer-field").locator("input"),
    readonly noteTextArea = page.getByTestId("note-field").locator('[name="note"]'),
    readonly requiresActivationCheckbox = page
      .getByTestId("requires-activation-section")
      .locator("input"),
    readonly issueButton = page.getByTestId("submit"),
    readonly okButton = page.getByTestId("submit"),
    readonly copyCodeButton = page.getByTestId("copy-code-button"),
    readonly dropdown = page.getByTestId("autocomplete-dropdown"),
    readonly option = page.getByTestId("single-autocomplete-select-option"),
  ) {
    super(page);
  }

  async clickIssueButton() {
    await this.issueButton.click();
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

  async selectCustomer(customer: string) {
    await this.customerInput.fill(customer);
    await this.dropdown.waitFor({ state: "attached" });
    await this.option.filter({ hasText: customer }).waitFor({ state: "visible" });
    await this.option.filter({ hasText: customer }).click();
    await this.waitForDOMToFullyLoad();
    await expect(this.customerInput).toHaveValue(customer);
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
    await this.sendToCustomerCheckbox.waitFor({ state: "visible" });
    await expect(this.sendToCustomerCheckbox).toBeEnabled();
    await this.waitForNetworkIdleAfterAction(async () => {
      await this.sendToCustomerCheckbox.check({ force: true });
    }),
      await this.waitForDOMToFullyLoad();
    await expect(this.sendToCustomerCheckbox).toBeChecked();
    await this.customerInput.waitFor({ state: "visible" });
    await expect(this.customerInput).toBeEnabled();
  }

  async clickSendExpireDateCheckbox() {
    await this.sendExpireDateCheckbox.waitFor({ state: "visible" });
    await expect(this.sendExpireDateCheckbox).toBeEnabled();
    await this.sendExpireDateCheckbox.check({ force: true });
    await this.waitForDOMToFullyLoad();
    await expect(this.sendExpireDateCheckbox).toBeChecked();
    await this.giftCardExpireFields.waitFor({ state: "visible" });
  }

  async clickRequiresActivationCheckbox() {
    await this.requiresActivationCheckbox.click();
  }

  async getGiftCardCode() {
    const allTexts = await this.cardCode.allTextContents();

    return allTexts[0];
  }
}
