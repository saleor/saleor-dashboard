import { URL_LIST } from "@data/url";
import { AddTrackingDialog } from "@dialogs/addTrackingDialog";
import { ManualTransactionDialog } from "@dialogs/manualTransactionDialog";
import { MarkOrderAsPaidDialog } from "@dialogs/markOrderAsPaidDialog";
import { RightSideDetailsPage } from "@pageElements/rightSideDetailsSection";
import { BasePage } from "@pages/basePage";
import { AddProductsDialog } from "@pages/dialogs/addProductsDialog";
import { AddressDialog } from "@pages/dialogs/addressDialog";
import { OrderCreateDialog } from "@pages/dialogs/orderCreateDialog";
import { ShippingAddressDialog } from "@pages/dialogs/shippingMethodDialog";
import { Page } from "@playwright/test";

export class OrdersPage extends BasePage {
  orderCreateDialog: OrderCreateDialog;
  markOrderAsPaidDialog: MarkOrderAsPaidDialog;
  addProductsDialog: AddProductsDialog;
  addressDialog: AddressDialog;
  shippingAddressDialog: ShippingAddressDialog;
  basePage: BasePage;
  manualTransactionDialog: ManualTransactionDialog;
  addTrackingDialog: AddTrackingDialog;
  rightSideDetailsPage: RightSideDetailsPage;

  constructor(
    page: Page,
    readonly createOrderButton = page.getByTestId("create-order-button"),
    readonly markAsPaidButton = page.getByTestId("markAsPaidButton"),
    readonly addTrackingButton = page.getByTestId("add-tracking-button"),
    readonly editTrackingButton = page.getByTestId("edit-tracking-button"),
    readonly setTrackingNumber = page.getByTestId("tracking-number-set"),
    readonly manualTransactionButton = page.getByTestId("captureManualTransactionButton"),
    readonly orderSummarySection = page.getByTestId("OrderSummaryCard"),
    readonly paymentSummarySection = page.getByTestId("payment-section"),
    readonly paymentStatusInfo = page.getByTestId("payment-status"),
    readonly balanceStatusInfo = page.getByTestId("order-balance-status"),
    readonly fulfillButton = page.getByTestId("fulfill-button"),
    readonly addProducts = page.getByTestId("add-products-button"),
    readonly orderTransactionsList = page.getByTestId("orderTransactionsList").locator("table"),
    readonly salesChannel = page.getByTestId("salesChannel"),
    readonly addShippingCarrierLink = page.getByTestId("add-shipping-carrier"),
    readonly finalizeButton = page.getByTestId("button-bar-confirm"),

    readonly customerEmail = page.getByTestId("customer-email"),
  ) {
    super(page);
    this.markOrderAsPaidDialog = new MarkOrderAsPaidDialog(page);
    this.orderCreateDialog = new OrderCreateDialog(page);
    this.basePage = new BasePage(page);
    this.addProductsDialog = new AddProductsDialog(page);
    this.addressDialog = new AddressDialog(page);
    this.shippingAddressDialog = new ShippingAddressDialog(page);
    this.manualTransactionDialog = new ManualTransactionDialog(page);
    this.addTrackingDialog = new AddTrackingDialog(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
  }

  async clickCreateOrderButton() {
    await this.createOrderButton.click();
  }

  async clickAddTrackingButton() {
    await this.addTrackingButton.click();
  }

  async clickManualTransactionButton() {
    await this.manualTransactionButton.click();
  }

  async clickMarkAsPaidButton() {
    await this.markAsPaidButton.waitFor({ state: "visible", timeout: 60000 });
    await this.markAsPaidButton.click();
  }

  async clickFulfillButton() {
    await this.fulfillButton.click();
  }

  async clickAddShippingCarrierButton() {
    await this.addShippingCarrierLink.click();
  }

  async clickAddProductsButton() {
    await this.addProducts.click();
  }

  async clickFinalizeButton() {
    await this.finalizeButton.click({ timeout: 90000 });
  }

  async expectSuccessBanner() {
    await this.basePage.expectSuccessBanner();
  }

  async goToOrdersListView() {
    await this.page.goto(URL_LIST.orders);
  }

  async goToExistingOrderPage(orderId: string) {
    const orderLink = URL_LIST.orders + orderId;
    await console.log("Navigating to order details view: " + orderLink);
    await this.page.goto(orderLink);
  }
}
