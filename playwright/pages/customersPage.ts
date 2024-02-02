import { URL_LIST } from "@data/url";
import { Page, expect } from "@playwright/test";
import { AddressForm, customerAddress} from "@forms/addressForm";
import { BasePage } from "@pages/basePage";
import { DeleteDialog } from '@dialogs/deleteDialog';
import { IssueGiftCardDialog } from "@dialogs/issueGiftCardDialog";

export class CustomersPage extends BasePage {
  readonly addressForm: AddressForm;
  readonly deleteDialog: DeleteDialog;
  readonly issueGiftCardDialog: IssueGiftCardDialog;

  constructor(
    page: Page,
    readonly createCustomerButton = page.getByTestId("create-customer"),
    readonly customerFirstNameInput = page
      .getByTestId("customer-first-name")
      .locator("input"),
    readonly customerLastNameInput = page
      .getByTestId("customer-last-name")
      .locator("input"),
    readonly customerEmailInput = page
      .getByTestId("customer-email")
      .locator("input"),
    readonly customerNoteInput = page
      .getByTestId("customer-note")
      .locator("textarea[name='note']"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly deleteButton = page.getByTestId("button-bar-delete"),
    readonly issueNewGiftCardButton = page.getByTestId("issue-new-gift-card"),
    readonly menageAddressButton = page.getByTestId("manage-addresses"),
    readonly showMoreMenuButton = page.getByTestId("show-more-button"),
    readonly editAddressButton = page.getByTestId("edit-address"),
  ) {
    super(page);
    this.addressForm = new AddressForm(page);
    this.deleteDialog = new DeleteDialog(page);
    this.issueGiftCardDialog = new IssueGiftCardDialog(page);
  }

  async goToCustomersListView() {
    await this.page.goto(URL_LIST.customers);
  }
  async gotoCustomerDetailsPage(customerId: string) {
    const existingCustomerUrl = `${URL_LIST.customers}${customerId}`;
    console.info(`Navigating to existing customer: ${existingCustomerUrl}`);
    await this.page.goto(existingCustomerUrl);
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
  async clickOnCreateCustomer() {
    await this.createCustomerButton.click();
  }
  async fillName(firstName: string, lastName: string) {
    await this.customerFirstNameInput.fill(firstName, { timeout: 1000000 });
    await this.customerLastNameInput.fill(lastName);
  }
  async fillEmail(email: string) {
    await this.customerEmailInput.fill(email);
  }
  async fillAddress(customerInfo: customerAddress) {
    await this.addressForm.fillAddressFormAllFields(customerInfo);
  }
  async fillNote(note: string) {
    await this.customerNoteInput.fill(note);
  }
  async saveCustomer() {
    await this.saveButton.click();
  }
  async deleteCustomer() {
    await this.deleteButton.click();
  }
  async clickIssueNewGiftCard() {
    await this.issueNewGiftCardButton.click();
  }
  async clickMenageAddresses() {
    await this.menageAddressButton.click();
  }
  async clickShowMoreMenu() {
    await this.showMoreMenuButton.click();
  }
  async clickEditAddress() {
    await this.editAddressButton.click()
  }
}
