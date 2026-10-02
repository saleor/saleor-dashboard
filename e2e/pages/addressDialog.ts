import { type Page } from "@playwright/test";

export interface AddressFields {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  city: string;
  postalCode: string;
  /** As the country picker lists it, e.g. "United States of America". */
  country: string;
  /** As the country-area picker lists it, e.g. "New York". */
  countryArea: string;
}

/**
 * The address dialog orders open for a customer's shipping and billing address - from
 * "Edit" on either section, and after assigning a customer to a draft. Ported from the
 * legacy `AddressDialog` and `AddressForm`; the field ids are unchanged.
 */
export class AddressDialog {
  readonly dialog = this.page.getByRole("dialog");

  readonly customerAddressOption = this.dialog.getByRole("radio", {
    name: "Use one of customer addresses",
  });

  readonly newAddressOption = this.dialog.getByRole("radio", { name: "Add new address" });

  readonly firstNameInput = this.page.getByTestId("first-name-input");

  readonly lastNameInput = this.page.getByTestId("last-name-input");

  readonly streetAddress1Input = this.page.getByTestId("address-line-1-input");

  readonly cityInput = this.page.getByTestId("city-input");

  readonly postalCodeInput = this.page.getByTestId("zip-input");

  readonly countryInput = this.page.getByTestId("address-edit-country-select-field");

  readonly countryAreaInput = this.page.getByTestId("address-edit-country-area-field");

  readonly option = this.page.getByTestId("select-option");

  readonly sameForBillingCheckbox = this.dialog.getByRole("checkbox", {
    name: "Set the same for billing address",
  });

  readonly submitButton = this.dialog.getByTestId("submit");

  constructor(readonly page: Page) {}

  async useCustomerAddress() {
    await this.customerAddressOption.click();
    await this.save();
  }

  /** Fills an empty form - a customer with no address book lands on one directly. */
  async fillNewAddress(address: AddressFields) {
    await this.firstNameInput.fill(address.firstName);
    await this.lastNameInput.fill(address.lastName);
    await this.streetAddress1Input.fill(address.streetAddress1);
    await this.cityInput.fill(address.city);
    await this.postalCodeInput.fill(address.postalCode);
    await this.countryInput.fill(address.country);
    await this.option.filter({ hasText: address.country }).first().click();
    await this.countryAreaInput.fill(address.countryArea);
    await this.option.filter({ hasText: new RegExp(`^${address.countryArea}$`) }).click();
  }

  /**
   * "Add new address" starts from the order's current address, so a change is only the
   * fields that differ.
   */
  async changeAddress(changes: Pick<AddressFields, "firstName" | "streetAddress1">) {
    await this.newAddressOption.click();
    await this.firstNameInput.fill(changes.firstName);
    await this.streetAddress1Input.fill(changes.streetAddress1);
    await this.save();
  }

  async save() {
    await this.submitButton.click();
    await this.dialog.waitFor({ state: "hidden" });
  }
}
