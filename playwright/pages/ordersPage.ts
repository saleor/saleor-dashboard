import { URL_LIST } from "@data/url";
import { AddProductsDialog } from "@pages/dialogs/addProductsDialog";
import { AddressDialog } from "@pages/dialogs/addressDialog";
import { OrderCreateDialog } from "@pages/dialogs/orderCreateDialog";
import { ShippingAddressDialog } from "@pages/dialogs/shippingMethodDialog";
import { Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class OrdersPage extends BasePage {
  orderCreateDialog: OrderCreateDialog;
  addProductsDialog: AddProductsDialog;
  addressDialog: AddressDialog;
  shippingAddressDialog: ShippingAddressDialog;
  basePage: BasePage;

  constructor(
    page: Page,
    readonly createOrderButton = page.getByTestId("create-order-button"),
    readonly markAsPaidButton = page.getByTestId("markAsPaidButton"),
    readonly orderSummarySection = page.getByTestId("OrderSummaryCard"),
    readonly paymentSummarySection = page.getByTestId("payment-section"),
    readonly fulfillButton = page.getByTestId("fulfill-button"),
    readonly addProducts = page.getByTestId("add-products-button"),
    readonly salesChannel = page.getByTestId("salesChannel"),
    readonly editCustomerButton = page.getByTestId("edit-customer"),
    readonly searchCustomerInput = page.getByTestId("select-customer"),
    readonly addShippingCarrierLink = page.getByTestId("add-shipping-carrier"),
    readonly finalizeButton = page.getByTestId("button-bar-confirm"),
    readonly editShippingAddress = page.getByTestId("edit-shipping-address"),
    readonly editBillingAddress = page.getByTestId("edit-billing-address"),
    readonly customerEmail = page.getByTestId("customer-email"),
    readonly selectCustomerOption = page.getByTestId(
      "single-autocomplete-select-option",
    ),
  ) {
    super(page);
    this.orderCreateDialog = new OrderCreateDialog(page);
    this.basePage = new BasePage(page);
    this.addProductsDialog = new AddProductsDialog(page);
    this.addressDialog = new AddressDialog(page);
    this.shippingAddressDialog = new ShippingAddressDialog(page);
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
  async clickAddProductsButton() {
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

  async goToOrdersListView() {
    await this.page.goto(URL_LIST.orders);
  }
}
