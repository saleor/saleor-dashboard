import { URL_LIST } from "@data/url";
import { AddLineRefundReasonDialog } from "@pages/dialogs/lineRefundReasonDialog";
import { OrdersPage } from "@pages/ordersPage";
import { expect, Page } from "@playwright/test";

export class RefundPage extends OrdersPage {
  addLineRefundReasonDialog: AddLineRefundReasonDialog;

  constructor(
    page: Page,
    readonly allButton = page.getByTestId("all-button"),
    readonly productQuantityInput = page.getByTestId("product-quantity-input"),
    readonly maxLineRefundQuantity = page.getByTestId("max-line-refund-quantity"),
    readonly refundReasonInput = page.getByTestId("refund-reason-input"),
    readonly lineRefundReasonDialog = page.getByTestId("refund-reason-dialog"),
    readonly lineRefundReasonButton = page.getByTestId("line-refund-reason-button"),
    readonly transactionCard = page.getByTestId("transaction-card"),
    readonly transactionEventRow = page.getByTestId("transaction-event-row"),
    readonly refundAmountInput = page.getByTestId("refund-amount"),
    readonly amountErrorMessage = page.getByTestId("error-message"),
  ) {
    super(page);
    this.addLineRefundReasonDialog = new AddLineRefundReasonDialog(page);
  }

  async getProductRow(productName: string) {
    return await this.page.locator("table tr").filter({ hasText: productName });
  }

  async expectAddLineItemsRefundPageOpen(orderId: string) {
    const orderLink = `${URL_LIST.orders}${orderId}/refund`;

    await expect(this.page).toHaveURL(orderLink);
    await this.waitForDOMToFullyLoad();
    await expect(this.pageHeader).toContainText("Create refund with line items");
  }

  async expectEditLineItemsRefundPageOpen(orderId: string, refundId: string) {
    const orderLink = `${URL_LIST.orders}${orderId}/refund/${refundId}`;

    await expect(this.page).toHaveURL(orderLink);
    await this.waitForDOMToFullyLoad();
    await expect(this.pageHeader).toContainText("Create refund with line items");
  }

  async expectManualRefundPageOpen(orderId: string) {
    const orderLink = `${URL_LIST.orders}${orderId}/manual-refund`;

    await expect(this.page).toHaveURL(orderLink);
    await expect(this.pageHeader).toContainText("Refund with manual amount");
  }

  async pickAllProductQuantityToRefund(productName: string) {
    const productRow = await this.getProductRow(productName);

    await productRow.locator(this.allButton).click();

    const maxLineRefundQuantityText = await productRow
      .locator(this.maxLineRefundQuantity)
      .first()
      .innerText();
    const value = maxLineRefundQuantityText.slice(-1);

    await expect(productRow.locator(this.productQuantityInput)).toHaveValue(value);
  }

  async provideRefundReason(reason: string) {
    await this.refundReasonInput.fill(reason);
  }

  async clickLineRefundReasonButton(productName: string) {
    const productRow = await this.getProductRow(productName);

    await productRow.locator(this.lineRefundReasonButton).click();
    await this.lineRefundReasonDialog.waitFor({ state: "visible" });
  }

  async inputProductLineQuantity(productName: string, amount: string) {
    const productRow = await this.getProductRow(productName);

    await productRow.locator(this.productQuantityInput).fill(amount);
    await expect(productRow.locator(this.productQuantityInput)).toHaveValue(amount);
  }

  async saveDraft() {
    await expect(this.saveButton).toHaveText("Save draft");
    await this.clickSaveButton();
    await this.waitForDOMToFullyLoad();
  }

  async selectTransactionToRefund(transactionId: string) {
    await this.waitForDOMToFullyLoad();

    await this.transactionCard.locator(`id=${transactionId}`).click();
  }

  async provideRefundAmount(amount: string) {
    await this.refundAmountInput.fill("");
    await this.refundAmountInput.fill(amount);
  }

  async transferFunds() {
    await expect(this.saveButton).toHaveText("Transfer funds");
    await this.clickSaveButton();
    await this.waitForDOMToFullyLoad();
  }

  async expectErrorMessage(error: string) {
    expect(this.amountErrorMessage).toHaveText(error);
  }
}
