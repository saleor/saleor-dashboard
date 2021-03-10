import * as checkoutRequest from "../apiRequests/Checkout";
import * as orderRequest from "../apiRequests/Order";

export function createWaitingForCaptureOrder(
  channelSlug,
  email,
  variantsList,
  shippingMethodId
) {
  let checkout;
  return createCheckout(channelSlug, email, variantsList)
    .then(checkoutResp => {
      checkout = checkoutResp;
      checkoutRequest.addShippingMethod(checkout.id, shippingMethodId);
    })
    .then(() => addPayment(checkout.id))
    .then(() => checkoutRequest.completeCheckout(checkout.id))
    .then(() => checkout);
}
export function createReadyToFulfillOrder(
  customerId,
  shippingMethodId,
  channelId,
  variantsList
) {
  let order;
  return createDraftOrder(customerId, shippingMethodId, channelId)
    .then(orderResp => {
      order = orderResp;
      variantsList.forEach(variantElement => {
        orderRequest.addProductToOrder(order.id, variantElement.id);
      });
    })
    .then(() => orderRequest.markOrderAsPaid(order.id))
    .then(() => orderRequest.completeOrder(order.id));
}
export function createDraftOrder(customerId, shippingMethodId, channelId) {
  return orderRequest
    .createDraftOrder(customerId, shippingMethodId, channelId)
    .its("body.data.draftOrderCreate.order");
}
export function createCheckout(channelSlug, email, variantsList) {
  return checkoutRequest
    .createCheckout(channelSlug, email, 1, variantsList)
    .its("body.data.checkoutCreate.checkout");
}
export function addPayment(checkoutId) {
  return checkoutRequest.addPayment(
    checkoutId,
    "mirumee.payments.dummy",
    "not-charged"
  );
}
