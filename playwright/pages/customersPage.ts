import { URL_LIST } from "@data/url";
import { AddressDialog } from "@dialogs/addressDialog";
import { DeleteDialog } from "@dialogs/deleteDialog";
import { IssueGiftCardDialog } from "@dialogs/issueGiftCardDialog";
import { AddressForm } from "@forms/addressForm";
import { BasePage } from "@pages/basePage";
import { Page } from "@playwright/test";

export class CustomersPage extends BasePage {
  readonly addressForm: AddressForm;

  readonly deleteDialog: DeleteDialog;

  readonly issueGiftCardDialog: IssueGiftCardDialog;

  readonly addressDialog: AddressDialog;

  constructor(
    page: Page,
    readonly createCustomerButton = page.getByTestId("create-customer"),
    readonly customerFirstNameInput = page.getByTestId("customer-first-name").locator("input"),
    readonly customerLastNameInput = page.getByTestId("customer-last-name").locator("input"),
    readonly customerEmailInput = page.getByTestId("customer-email").locator("input"),
    readonly customerNoteInput = page.getByTestId("customer-note").locator("textarea[name='note']"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly deleteButton = page.getByTestId("button-bar-delete"),
    readonly issueNewGiftCardButton = page.getByTestId("issue-new-gift-card"),
    readonly emailPageTitleText = page.getByTestId("user-email-title"),
    readonly customerActiveCheckbox = page.getByTestId("customer-active-checkbox").locator("input"),
  ) {
    super(page);
    this.addressForm = new AddressForm(page);
    this.deleteDialog = new DeleteDialog(page);
    this.issueGiftCardDialog = new IssueGiftCardDialog(page);
    this.addressDialog = new AddressDialog(page);
  }

  async goToCustomersListView() {
    await this.waitForNetworkIdle(async () => {
      await this.page.goto(URL_LIST.customers);
    });
  }

  async searchForCustomer(customer: string) {
    await this.searchInputListView.fill(customer);
  }

  async gotoCustomerDetailsPage(customerId: string) {
    await this.waitForNetworkIdle(async () => {
      await this.page.goto(`${URL_LIST.customers}${customerId}`);
    });
  }

  async clickOnCreateCustomer() {
    await this.createCustomerButton.click();
  }

  async fillFirstAndLastName(firstName: string, lastName: string) {
    await this.customerFirstNameInput.fill(firstName, { timeout: 1000000 });
    await this.customerLastNameInput.fill(lastName);
  }

  async fillEmail(email: string) {
    await this.customerEmailInput.fill(email);
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
    await this.waitForNetworkIdle(async () => {
      await this.issueNewGiftCardButton.click();
    });
  }

  async clickCustomerActiveCheckbox() {
    await this.customerActiveCheckbox.click();
  }
}
