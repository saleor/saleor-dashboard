import * as checkoutRequest from "../apiRequests/Checkout";
import * as orderRequest from "../apiRequests/Order";

export function createWaitingForCaptureOrder(
  channelSlug,
  email,
  variantsList,
  shippingMethodId
) {
  let checkout;
  return createCheckout({ channelSlug, email, variantsList })
    .then(checkoutResp => {
      checkout = checkoutResp;
      checkoutRequest.addShippingMethod(checkout.id, shippingMethodId);
    })
    .then(() => addPayment(checkout.id))
    .then(() => checkoutRequest.completeCheckout(checkout.id))
    .then(() => checkout);
}
export function createCheckoutWithVoucher({
  channelSlug,
  email = "email@example.com",
  variantsList,
  address,
  shippingMethodId,
  voucherCode,
  auth
}) {
  let checkout;
  return createCheckout({ channelSlug, email, variantsList, address, auth })
    .then(checkoutResp => {
      checkout = checkoutResp;
      checkoutRequest.addShippingMethod(checkout.id, shippingMethodId);
    })
    .then(() => {
      checkoutRequest.addVoucher(checkout.id, voucherCode);
    })
    .its("body.data.checkoutAddPromoCode");
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
      assignVariantsToOrder(order, variantsList);
    })
    .then(() => orderRequest.markOrderAsPaid(order.id))
    .then(() => orderRequest.completeOrder(order.id));
}

export function createOrder({
  customerId,
  shippingMethodId,
  channelId,
  variantsList
}) {
  let order;
  return createDraftOrder(customerId, shippingMethodId, channelId)
    .then(orderResp => {
      order = orderResp;
      assignVariantsToOrder(order, variantsList);
    })
    .then(() => orderRequest.completeOrder(order.id))
    .then(() => order);
}

function assignVariantsToOrder(order, variantsList) {
  variantsList.forEach(variantElement => {
    orderRequest.addProductToOrder(order.id, variantElement.id);
  });
}

export function createDraftOrder(customerId, shippingMethodId, channelId) {
  return orderRequest
    .createDraftOrder(customerId, shippingMethodId, channelId)
    .its("body.data.draftOrderCreate.order");
}
export function createCheckout({
  channelSlug,
  email,
  variantsList,
  address,
  auth
}) {
  return checkoutRequest
    .createCheckout({
      channelSlug,
      email,
      productQuantity: 1,
      variantsList,
      address,
      auth
    })
    .its("body.data.checkoutCreate.checkout");
}
export function addPayment(checkoutId) {
  return checkoutRequest.addPayment(
    checkoutId,
    "mirumee.payments.dummy",
    "not-charged"
  );
}
