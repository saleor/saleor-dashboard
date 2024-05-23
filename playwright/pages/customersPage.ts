import type { Page } from "@playwright/test";

export class CustomersPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly createCustomerButton = page.getByTestId("create-customer"),
  ) {
    super(page);
    this.addressForm = new AddressForm(page);
    this.deleteDialog = new DeleteDialog(page);
    this.issueGiftCardDialog = new IssueGiftCardDialog(page);
    this.addressDialog = new AddressDialog(page);
  }

  async goToCustomersListView() {
    await this.waitForNetworkIdleAfterAction(async () => {
      await this.page.goto(URL_LIST.customers);
    });
  }

  async searchForCustomer(customer: string) {
    await this.searchInputListView.fill(customer);
  }

  async gotoCustomerDetailsPage(customerId: string) {
    await this.waitForNetworkIdleAfterAction(async () => {
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
    await this.waitForNetworkIdleAfterAction(async () => {
      await this.issueNewGiftCardButton.click();
    });
  }

  async clickCustomerActiveCheckbox() {
    await this.customerActiveCheckbox.click();
  }
}
