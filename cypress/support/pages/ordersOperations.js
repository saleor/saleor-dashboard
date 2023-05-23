import {
  ADD_PRODUCT_TO_ORDER_DIALOG,
  CHANNEL_FORM_SELECTORS,
  DRAFT_ORDER_SELECTORS,
  ORDERS_SELECTORS,
  SHARED_ELEMENTS,
} from "../../elements";

export function pickAndSelectChannelOnCreateOrderFormByIndex(index) {
  cy.get(ORDERS_SELECTORS.createOrderButton)
    .click()
    .get(CHANNEL_FORM_SELECTORS.channelSelect)
    .click()
    .get(CHANNEL_FORM_SELECTORS.channelOption)
    .eq(index)
    .click();
}
export function applyFixedLineDiscountForProduct(
  discountAmount,
  discountReason,
) {
  cy.get(ORDERS_SELECTORS.dataGridTable).should("be.visible");
  cy.get(ORDERS_SELECTORS.priceCellFirstRowOrderDetails)
    .dblclick({ force: true })
    .type("2", { force: true });
  cy.get(ORDERS_SELECTORS.discountFixedPriceButton).click();
  cy.get(ORDERS_SELECTORS.discountAmountField).type(discountAmount);
  cy.get(ORDERS_SELECTORS.discountReasonField).type(discountReason);
  cy.addAliasToGraphRequest("OrderLineDiscountUpdate")
    .clickSubmitButton()
    .click()
    .waitForRequestAndCheckIfNoErrors("@OrderLineDiscountUpdate");
}
export function changeQuantityOfProducts() {
  cy.get(ORDERS_SELECTORS.dataGridTable).should("be.visible");
  cy.get(ORDERS_SELECTORS.quantityCellFirstRowOrderDetails)
    .dblclick({ force: true })
    .type("2", { force: true });
  cy.addAliasToGraphRequest("OrderLineUpdate")
    // grid expects focus to be dismissed from cell - because of that extra action needed which blur focus from cell (other more elegant build in actions was not working)
    .get(SHARED_ELEMENTS.pageHeader)
    .click()
    .waitForRequestAndCheckIfNoErrors("@OrderLineUpdate");
}
export function deleteProductFromGridTableOnIndex(trIndex = 0) {
  cy.get(ORDERS_SELECTORS.dataGridTable).should("be.visible");
  cy.addAliasToGraphRequest("OrderLineDelete")
    .get(ORDERS_SELECTORS.productDeleteFromRowButton)
    .eq(trIndex)
    .click()
    .wait("@OrderLineDelete");
}
export function addNewProductToOrder(productIndex = 0, variantIndex = 0) {
  cy.get(DRAFT_ORDER_SELECTORS.addProducts).click();
  return cy
    .get(ADD_PRODUCT_TO_ORDER_DIALOG.productRow)
    .eq(productIndex)
    .find(ADD_PRODUCT_TO_ORDER_DIALOG.productName)
    .invoke("text")
    .then(productName => {
      cy.get(ADD_PRODUCT_TO_ORDER_DIALOG.productVariant)
        .eq(variantIndex)
        .find(ADD_PRODUCT_TO_ORDER_DIALOG.checkbox)
        .click();
      cy.addAliasToGraphRequest("OrderLinesAdd")
        .get('[type="submit"]')
        .click()
        .waitForRequestAndCheckIfNoErrors("@OrderLinesAdd");
      cy.wrap(productName);
    });
}
