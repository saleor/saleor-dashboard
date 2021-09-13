import { DRAFT_ORDER_SELECTORS } from "../elements/orders/draft-order-selectors";
import { ASSIGN_ELEMENTS_SELECTORS } from "../elements/shared/assign-elements-selectors";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";
import { SELECT_SHIPPING_METHOD_FORM } from "../elements/shipping/select-shipping-method-form";
import { assignElements } from "./shared/assignElements";

export function finalizeDraftOrder(name, address) {
  cy.get(DRAFT_ORDER_SELECTORS.addProducts).click();
  assignElements(name);
  cy.get(DRAFT_ORDER_SELECTORS.editCustomerButton)
    .click()
    .get(DRAFT_ORDER_SELECTORS.selectCustomer)
    .type(name);
  cy.contains(DRAFT_ORDER_SELECTORS.selectCustomerOption, name)
    .click()
    .get(DRAFT_ORDER_SELECTORS.customerEmail)
    .should("be.visible")
    .get(SHARED_ELEMENTS.skeleton)
    .should("not.exist")
    .get(BUTTON_SELECTORS.submit)
    .click()
    .get(DRAFT_ORDER_SELECTORS.addShippingCarrierLink)
    .click()
    .get(SELECT_SHIPPING_METHOD_FORM.selectShippingMethod)
    .click()
    .get(SELECT_SHIPPING_METHOD_FORM.shippingMethodOption)
    .first()
    .click();
  cy.addAliasToGraphRequest("OrderShippingMethodUpdate")
    .get(SELECT_SHIPPING_METHOD_FORM.submitButton)
    .click();
  cy.wait("@OrderShippingMethodUpdate");
  cy.getTextFromElement(DRAFT_ORDER_SELECTORS.pageHeader).as(
    "draftOrderNumber"
  );
  cy.addAliasToGraphRequest("OrderDraftFinalize");
  cy.get(DRAFT_ORDER_SELECTORS.finalizeButton).click();
  cy.wait("@OrderDraftFinalize");
  return cy.get("@draftOrderNumber");
}
