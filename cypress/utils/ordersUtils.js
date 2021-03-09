import * as checkoutRequest from "../apiRequests/Checkout";
import * as orderRequest from "../apiRequests/Order";

let checkout;
let order;

export function createWaitingForCaptureOrder(
  channelSlug,
  email,
  variantsList,
  shippingMethodId
) {
  return createCheckout(channelSlug, email, variantsList)
    .then(() =>
      checkoutRequest.addShippingMethod(checkout.id, shippingMethodId)
    )
    .then(() => addPayment(checkout.id))
    .then(() => checkoutRequest.completeCheckout(checkout.id));
}
export function createReadyToFulfillOrder(
  customerId,
  shippingMethodId,
  channelId,
  variantsList
) {
  return createDraftOrder(customerId, shippingMethodId, channelId)
    .then(() => {
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
    .then(resp => (order = resp.body.data.draftOrderCreate.order));
}
export function createCheckout(channelSlug, email, variantsList) {
  return checkoutRequest
    .createCheckout(channelSlug, email, 1, variantsList)
    .then(resp => (checkout = resp.body.data.checkoutCreate.checkout));
}
export function addPayment(checkoutId) {
  return checkoutRequest.addPayment(
    checkoutId,
    "mirumee.payments.dummy",
    "not-charged"
  );
}
