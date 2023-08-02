import {
  ADD_PRODUCT_TO_ORDER_DIALOG,
  BUTTON_SELECTORS,
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
  cy.addAliasToGraphRequest("OrderLineUpdate");
  cy.get(ORDERS_SELECTORS.dataGridTable).should("be.visible");
  cy.get(ORDERS_SELECTORS.quantityCellFirstRowOrderDetails)
    .click({ force: true })
    .should("have.attr", "aria-selected", "true")
    .click({ force: true })
    .wait(1000);
  cy.get(ORDERS_SELECTORS.gridClip)
    .find("input")
    .clear({ force: true })
    .type("2");

  // grid expects focus to be dismissed from cell - because of that extra action needed which blur focus from cell (other more elegant build in actions was not working)
  cy.get(SHARED_ELEMENTS.pageHeader)
    .click()
    .waitForRequestAndCheckIfNoErrors("@OrderLineUpdate");
}
export function deleteProductFromGridTableOnIndex(trIndex = 0) {
  cy.get(ORDERS_SELECTORS.dataGridTable).should("be.visible");
  cy.addAliasToGraphRequest("OrderLineDelete")
    .get(BUTTON_SELECTORS.showMoreButton)
    .eq(trIndex)
    .click()
    .get(ORDERS_SELECTORS.productDeleteFromRowButton)
    .click()
    .wait("@OrderLineDelete");
}

export function openVariantDetailsOptions(variantIndex = 1) {
  return cy.get(BUTTON_SELECTORS.showMoreButton).eq(variantIndex).click();
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
