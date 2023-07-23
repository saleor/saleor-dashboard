import { DRAFT_ORDER_SELECTORS } from "../../elements/orders/draft-order-selectors";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { SELECT_SHIPPING_METHOD_FORM } from "../../elements/shipping/select-shipping-method-form";

export function finalizeDraftOrder(name) {
  cy.addAliasToGraphRequest("OrderDraftFinalize");
  cy.get(DRAFT_ORDER_SELECTORS.addProducts)
    .click()
    .assignElements(name)
    .get(DRAFT_ORDER_SELECTORS.editCustomerButton)
    .click()
    .get(DRAFT_ORDER_SELECTORS.selectCustomer)
    .type(name);
  return cy
    .contains(DRAFT_ORDER_SELECTORS.selectCustomerOption, name, {
      matchCase: false,
    })
    .click()
    .get(DRAFT_ORDER_SELECTORS.newAddressSelectButton)
    .should("be.visible")
    .get(BUTTON_SELECTORS.submit)
    .click()
    .get(DRAFT_ORDER_SELECTORS.customerEmail)
    .should("be.visible")
    .get(SHARED_ELEMENTS.skeleton)
    .should("not.exist")
    .get(DRAFT_ORDER_SELECTORS.addShippingCarrierLink)
    .click()
    .get(SELECT_SHIPPING_METHOD_FORM.selectShippingMethod)
    .click()
    .get(SELECT_SHIPPING_METHOD_FORM.shippingMethodOption)
    .first()
    .click()
    .addAliasToGraphRequest("OrderShippingMethodUpdate")
    .get(SELECT_SHIPPING_METHOD_FORM.submitButton)
    .click()
    .wait("@OrderShippingMethodUpdate")
    .get(DRAFT_ORDER_SELECTORS.finalizeButton)
    .click()
    .waitForRequestAndCheckIfNoErrors("@OrderDraftFinalize")
    .confirmationMessageShouldAppear();
}
