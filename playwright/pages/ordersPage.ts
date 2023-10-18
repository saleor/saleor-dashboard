import { AddProductsDialog } from "@pages/dialogs/addProductsDialog";
import { AddressDialog } from "@pages/dialogs/addressDialog";
import { OrderCreateDialog } from "@pages/dialogs/orderCreateDialog";
import { ShippingAddressDialog } from "@pages/dialogs/shippingMethodDialog";
import { Locator, Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class OrdersPage {
  readonly page: Page;
  readonly createOrderButton: Locator;

  readonly addProducts: Locator;
  readonly salesChannel: Locator;
  readonly editCustomerButton: Locator;
  readonly searchCustomerInput: Locator;
  readonly addShippingCarrierLink: Locator;
  readonly finalizeButton: Locator;
  readonly selectCustomerOption: Locator;

  readonly editShippingAddress: Locator;
  readonly editBillingAddress: Locator;
  readonly customerEmail: Locator;
  orderCreateDialog: OrderCreateDialog;
  addProductsDialog: AddProductsDialog;
  addressDialog: AddressDialog;
  shippingAddressDialog: ShippingAddressDialog;
  basePage: BasePage;

  constructor(page: Page) {
    this.page = page;
    this.orderCreateDialog = new OrderCreateDialog(page);
    this.basePage = new BasePage(page);
    this.addProductsDialog = new AddProductsDialog(page);
    this.addressDialog = new AddressDialog(page);
    this.shippingAddressDialog = new ShippingAddressDialog(page);
    this.createOrderButton = page.getByTestId("create-order-button");
    this.addProducts = page.getByTestId("add-products-button");
    this.salesChannel = page.getByTestId("salesChannel");
    this.editCustomerButton = page.getByTestId("edit-customer");
    this.searchCustomerInput = page.getByTestId("select-customer");
    this.addShippingCarrierLink = page.getByTestId("add-shipping-carrier");
    this.finalizeButton = page.getByTestId("button-bar-confirm");
    this.editShippingAddress = page.getByTestId("edit-shipping-address");
    this.editBillingAddress = page.getByTestId("edit-billing-address");
    this.customerEmail = page.getByTestId("customer-email");
    this.selectCustomerOption = page.getByTestId(
      "single-autocomplete-select-option",
    );
  }

  async selectCustomer(customer = "allison.freeman@example.com") {
    await this.selectCustomerOption.locator(`text=${customer}`).click();
  }
  async clickCreateOrderButton() {
    await this.createOrderButton.click();
  }
  async clickAddShippingCarrierButton() {
    await this.addShippingCarrierLink.click();
  }
  async clickAddOrderButton() {
    await this.addProducts.click();
  }
  async clickEditCustomerButton() {
    await this.editCustomerButton.click();
  }
  async clickSearchCustomerInput() {
    await this.searchCustomerInput.click();
  }
  async clickFinalizeButton() {
    await this.finalizeButton.click();
  }
  async expectSuccessBanner() {
    await this.basePage.expectSuccessBanner();
  }
}
