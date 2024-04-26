import { AddressFieldsType } from "@data/addresses";
import { expect, Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class AddressesListPage extends BasePage {
  constructor(
    page: Page,
    readonly editAddressButton = page.getByTestId("edit-address"),
    readonly deleteAddressButton = page.getByTestId("delete-address"),
    readonly addAddressButton = page.getByTestId("add-address"),
    readonly addressTypeTitle = page.getByTestId("address-type-title"),
    readonly addressCard = page.getByTestId("address-card"),
    readonly savedAddress = page.getByTestId("address"),
    readonly menageAddressButton = page.getByTestId("manage-addresses"),
    readonly showMoreMenuButton = page.getByTestId("show-more-button"),
    readonly addAddressDialog = page.getByTestId("add-address-dialog"),
    readonly setAsDefaultBilling = page.getByTestId("set-default-billing-address"),
    readonly setAsDefaultShipping = page.getByTestId("set-default-shipping-address"),
    readonly deleteDialog = page.getByTestId("delete-address-dialog-content"),
    readonly companyName = page.getByTestId("company-name"),
    readonly addressLines = page.getByTestId("addressLines"),
    readonly postalCodeAndCity = page.getByTestId("postal-code-and-city"),
    readonly countryAreaAndCountry = page.getByTestId("country-area-and-country"),
    readonly name = page.getByTestId("name"),
    readonly phone = page.getByTestId("phone"),
  ) {
    super(page);
  }

  async clickShowMoreMenu(addressPart: string) {
    await this.addressCard
      .filter({ hasText: addressPart })
      .locator(this.showMoreMenuButton)
      .click();
  }

  async clickManageAddresses() {
    await this.menageAddressButton.click();
  }

  async clickAddAddressButton() {
    await this.addAddressButton.click();
  }

  async clickEditAddress() {
    await this.editAddressButton.click();
  }

  async clickDeleteAddress() {
    await this.deleteAddressButton.click();
    await this.waitForDOMToFullyLoad();
  }

  async setAsDeafultShippingAddress() {
    await this.setAsDefaultShipping.click();
  }

  async setAsDeafultBillingAddress() {
    await this.setAsDefaultBilling.click();
  }

  async verifyRequiredAddressFields(addressPart: string, address: AddressFieldsType) {
    const addressToVerify = await this.savedAddress.filter({
      hasText: addressPart,
    });
    const city = address.city.toUpperCase();

    await expect(addressToVerify.locator(this.name)).toContainText(
      `${address.firstName} ${address.lastName}`,
    );
    await expect(addressToVerify.locator(this.addressLines)).toContainText(address.addressLine1);
    await expect(addressToVerify.locator(this.postalCodeAndCity)).toContainText(
      ` ${address.zip} ${city}`,
    );
    await expect(addressToVerify.locator(this.countryAreaAndCountry)).toContainText(
      address.country,
    );
  }

  async verifyPhoneField(addressPart: string, address: AddressFieldsType) {
    const addressToVerify = await this.savedAddress.filter({
      hasText: addressPart,
    });

    await expect(addressToVerify.locator(this.phone)).toContainText(address.phone);
  }

  async verifyCompanyField(addressPart: string, address: AddressFieldsType) {
    const addressToVerify = await this.savedAddress.filter({
      hasText: addressPart,
    });

    await expect(addressToVerify.locator(this.companyName)).toContainText(address.companyName);
  }

  async verifyAddressLine2Field(addressPart: string, address: AddressFieldsType) {
    const addressToVerify = await this.savedAddress.filter({
      hasText: addressPart,
    });

    await expect(addressToVerify.locator(this.addressLines)).toContainText(address.addressLine2);
  }
}
