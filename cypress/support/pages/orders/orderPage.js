import { ORDER_FULFILL_SELECTORS } from "../../../elements/orders/order-fulfill-selectors";
import { ORDER_SELECTORS } from "../../../elements/orders/order-selectors";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";

export function fulfillOrder(quantityToFulfill = 1) {
  return cy
    .get(ORDER_SELECTORS.fulfillOrderButton)
    .click()
    .get(ORDER_FULFILL_SELECTORS.fulfillOrderButton)
    .type(quantityToFulfill)
    .addAliasToGraphRequest("FulfillOrder")
    .get(BUTTON_SELECTORS.confirm)
    .click();
}

export function fulfillOrderWithInsufficientStock(quantityToFulfill = 1) {
  fulfillOrder(quantityToFulfill)
    .wait("@FulfillOrder")
    .its("response.body.data.orderFulfill.errors")
    .then(errors => expect(errors[0].code).to.eq("INSUFFICIENT_STOCK"));
  return cy
    .get(BUTTON_SELECTORS.submit)
    .click()
    .wait("@FulfillOrder")
    .its("response.body.data.orderFulfill");
}
