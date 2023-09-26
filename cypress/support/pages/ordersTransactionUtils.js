import {
  BUTTON_SELECTORS,
  ORDER_GRANT_REFUND,
  ORDER_TRANSACTION_CREATE,
  ORDERS_SELECTORS,
  SHARED_ELEMENTS,
} from "../../elements";

export function markAsPaidOrderWithRefNumber(transactionNumber) {
  cy.addAliasToGraphRequest("OrderMarkAsPaid");
  clickMarkAsPaidButton();
  typeTransactionReference(`ref_${transactionNumber}`);
  clickConfirmMarkAsPaidButton().waitForRequestAndCheckIfNoErrors(
    "@OrderMarkAsPaid",
  );
}
export function captureManualTransaction(
  transactionDescription,
  transactionPSPReference,
  amount,
) {
  clickCaptureManualTransactionButton();
  typeTransactionDescription(`desc_${transactionDescription}`);
  typeTransactionPSPReference(`psp_${transactionPSPReference}`);
  typeRefundTotalAmount(amount);
  clickCreateManualTransactionButton().confirmationMessageShouldAppear();
}
export function grantRefundAllProductsAndShippingWithReason(
  refundReason,
  total,
) {
  cy.addAliasToGraphRequest("OrderDetailsGrantRefund");
  clickGrantRefundButton();
  cy.waitForRequestAndCheckIfNoErrors("@OrderDetailsGrantRefund");
  clickMaxQuantityButton();
  typeRefundReason(refundReason);
  clickRefundShippingCheckbox();
  // this check makes sure no banner covers apply button which was making this action flaky
  cy.get(SHARED_ELEMENTS.notificationMessage).should("not.exist");
  clickApplyRefundButton();
  cy.get(ORDER_GRANT_REFUND.refundAmountInput).should("contain.value", total);
  clickConfirmRefundButton();
  cy.confirmationMessageShouldAppear();
}
export function sendRefundWithDescriptionPSPAndAmount(
  transactionDescription,
  transactionPSPReference,
  amount,
) {
  clickSendRefundButton();
  typeTransactionDescription(`desc_${transactionDescription}`);
  typeTransactionPSPReference(`psp_${transactionPSPReference}`);
  typeRefundTotalAmount(amount);
  cy.addAliasToGraphRequest("CreateManualTransactionRefund");
  clickRefundSubmitButton();
  cy.waitForRequestAndCheckIfNoErrors(
    "@CreateManualTransactionRefund",
  ).confirmationMessageShouldAppear();
}
export function clickMarkAsPaidButton() {
  return cy.clickOnElement(ORDERS_SELECTORS.markAsPaidButton);
}
export function clickRefundSubmitButton() {
  return cy.clickOnElement(ORDER_TRANSACTION_CREATE.manualTransactionSubmit);
}
export function clickCreateManualTransactionButton() {
  return cy.clickOnElement(ORDER_TRANSACTION_CREATE.manualTransactionSubmit);
}
export function clickMaxQuantityButton() {
  return cy.clickOnElement(ORDER_GRANT_REFUND.setMaxQuantityButton);
}
export function clickCaptureManualTransactionButton() {
  return cy.clickOnElement(ORDERS_SELECTORS.captureManualTransactionButton);
}
export function typeRefundReason(refundReasonDescription) {
  return cy
    .get(ORDER_GRANT_REFUND.refundReasonInput)
    .type(`reason_${refundReasonDescription}`);
}
export function typeRefundTotalAmount(amount) {
  return cy
    .get(ORDER_TRANSACTION_CREATE.transactAmountInput)
    .type(amount, { force: true });
}
export function typeTransactionReference(reference) {
  return cy.get(ORDERS_SELECTORS.transactionReferenceInput).type(reference);
}
export function typeTransactionDescription(transactionDescription) {
  return cy
    .get(ORDER_TRANSACTION_CREATE.transactionDescription)
    .type(`desc_${transactionDescription}`);
}
export function typeTransactionPSPReference(transactionPSPReference) {
  return cy
    .get(ORDER_TRANSACTION_CREATE.transactionPspReference)
    .type(`psp_${transactionPSPReference}`);
}
export function clickGrantRefundButton() {
  return cy.clickOnElement(ORDERS_SELECTORS.grantRefundButton);
}
export function clickSendRefundButton() {
  return cy.clickOnElement(ORDERS_SELECTORS.refundButton);
}
export function clickRefundShippingCheckbox() {
  return cy.clickOnElement(ORDER_GRANT_REFUND.refundShippingCheckbox);
}
export function clickApplyRefundButton() {
  return cy.clickOnElement(ORDER_GRANT_REFUND.applySelectedRefundButton);
}

export function clickConfirmRefundButton() {
  return cy.clickOnElement(ORDER_GRANT_REFUND.grantRefundButton);
}
export function clickConfirmMarkAsPaidButton() {
  return cy.clickOnElement(BUTTON_SELECTORS.submit);
}
