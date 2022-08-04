import * as checkoutRequest from "../requests/Checkout";
import * as orderRequest from "../requests/Order";
import {
  getPaymentMethodStripeId,
  sendConfirmationToStripe,
} from "../requests/stripe";
import { createProductInChannel } from "./products/productsUtils";

export function createWaitingForCaptureOrder({
  channelSlug,
  email,
  variantsList,
  shippingMethodName,
  address,
}) {
  let checkout;
  const auth = "token";
  cy.loginInShop();
  return checkoutRequest
    .createCheckout({
      channelSlug,
      email,
      variantsList,
      address,
      billingAddress: address,
      auth,
    })
    .then(({ checkout: checkoutResp }) => {
      checkout = checkoutResp;
      const shippingMethodId = getShippingMethodIdFromCheckout(
        checkout,
        shippingMethodName,
      );
      checkoutRequest.addShippingMethod(checkout.id, shippingMethodId);
    })
    .then(() => addPayment(checkout.id))
    .then(() => checkoutRequest.completeCheckout(checkout.id))
    .then(({ order }) => ({ checkout, order }));
}

export function getShippingMethodIdFromCheckout(checkout, shippingMethodName) {
  const availableShippingMethodsLength = checkout.shippingMethods.length;
  if (availableShippingMethodsLength === 0) {
    return null;
  } else {
    return checkout.shippingMethods.find(
      element => element.name === shippingMethodName,
    ).id;
  }
}

export function updateShippingInCheckout(checkoutToken, shippingMethodName) {
  return checkoutRequest.getCheckout(checkoutToken).then(checkout => {
    const shippingMethodId = getShippingMethodIdFromCheckout(
      checkout,
      shippingMethodName,
    );
    return checkoutRequest.checkoutShippingMethodUpdate(
      checkout.id,
      shippingMethodId,
    );
  });
}

export function createCheckoutWithVoucher({
  channelSlug,
  email = "email@example.com",
  variantsList,
  productQuantity = 1,
  address,
  shippingMethodName,
  voucherCode,
  auth,
}) {
  let checkout;
  return checkoutRequest
    .createCheckout({
      channelSlug,
      productQuantity,
      email,
      variantsList,
      address,
      billingAddress: address,
      auth,
    })
    .then(({ checkout: checkoutResp }) => {
      checkout = checkoutResp;
      const shippingMethodId = getShippingMethodIdFromCheckout(
        checkout,
        shippingMethodName,
      );
      checkoutRequest.addShippingMethod(checkout.id, shippingMethodId);
    })
    .then(() => {
      checkoutRequest.addVoucher(checkout.id, voucherCode);
    })
    .then(resp => ({
      addPromoCodeResp: resp.body.data.checkoutAddPromoCode,
      checkout,
    }));
}

export function purchaseProductWithPromoCode({
  channelSlug,
  email = "email@example.com",
  variantsList,
  address,
  shippingMethodName,
  voucherCode,
  auth,
}) {
  let checkout;

  return createCheckoutWithVoucher({
    channelSlug,
    email,
    variantsList,
    address,
    shippingMethodName,
    voucherCode,
    auth,
  })
    .then(({ checkout: checkoutResp }) => {
      checkout = checkoutResp;
      addPayment(checkout.id);
    })
    .then(() => checkoutRequest.completeCheckout(checkout.id))
    .then(({ order }) => ({ checkout, order }));
}

export function createReadyToFulfillOrder({
  customerId,
  shippingMethodId,
  channelId,
  variantsList,
  address,
}) {
  let order;
  return orderRequest
    .createDraftOrder({ customerId, shippingMethodId, channelId, address })
    .then(orderResp => {
      order = orderResp;
      assignVariantsToOrder(order, variantsList);
    })
    .then(() => orderRequest.completeOrder(order.id))
    .then(() => orderRequest.markOrderAsPaid(order.id));
}

export function createFulfilledOrder({
  customerId,
  shippingMethodId,
  channelId,
  variantsList,
  address,
  warehouse,
  quantity = 1,
}) {
  return createReadyToFulfillOrder({
    customerId,
    shippingMethodId,
    channelId,
    variantsList,
    address,
  }).then(({ order }) => {
    orderRequest.fulfillOrder({
      orderId: order.id,
      warehouse,
      quantity,
      linesId: order.lines,
    });
  });
}

export function createOrder({
  customerId,
  shippingMethodId,
  channelId,
  variantsList,
  address,
}) {
  let order;
  return orderRequest
    .createDraftOrder({ customerId, shippingMethodId, channelId, address })
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

export function addPayment(checkoutId) {
  return checkoutRequest.addPayment({
    checkoutId,
    gateway: "mirumee.payments.dummy",
    token: "not-charged",
  });
}

export function addAdyenPayment(checkoutId, amount) {
  return checkoutRequest.addPayment({
    checkoutId,
    gateway: "mirumee.payments.adyen",
    amount,
  });
}
export function addStripePayment(checkoutId, amount, token) {
  return checkoutRequest.addPayment({
    checkoutId,
    gateway: "saleor.payments.stripe",
    amount,
    token,
  });
}

export function createAndCompleteCheckoutWithoutShipping({
  channelSlug,
  email,
  variantsList,
  billingAddress,
  auth,
}) {
  let checkout;
  return checkoutRequest
    .createCheckout({ channelSlug, email, variantsList, billingAddress, auth })
    .then(({ checkout: checkoutResp }) => {
      checkout = checkoutResp;
      addPayment(checkout.id);
    })
    .then(() => checkoutRequest.completeCheckout(checkout.id))
    .then(({ order }) => ({ checkout, order }));
}

export function createOrderWithNewProduct({
  attributeId,
  categoryId,
  productTypeId,
  channel,
  name,
  warehouseId,
  quantityInWarehouse = 1,
  trackInventory = true,
  shippingMethod,
  address,
}) {
  let variantsList;
  return createProductInChannel({
    attributeId,
    categoryId,
    productTypeId,
    channelId: channel.id,
    name,
    warehouseId,
    quantityInWarehouse,
    trackInventory,
  })
    .then(({ variantsList: variantsListResp }) => {
      variantsList = variantsListResp;
      createWaitingForCaptureOrder({
        channelSlug: channel.slug,
        email: "email@example.com",
        variantsList,
        shippingMethodName: shippingMethod.name,
        address,
      });
    })
    .then(({ order, checkout }) => ({ order, checkout, variantsList }));
}

export function addStripePaymentAndGetConfirmationData({
  card,
  checkoutId,
  amount,
}) {
  let paymentMethodId;

  return getPaymentMethodStripeId(card)
    .then(resp => {
      paymentMethodId = resp.body.id;
      addStripePayment(checkoutId, amount, resp.body.id);
    })
    .then(() => {
      checkoutRequest.completeCheckout(checkoutId);
    })
    .then(resp => {
      const confirmationData = JSON.parse(resp.confirmationData);
      sendConfirmationToStripe(paymentMethodId, confirmationData.id, false);
    })
    .then(resp => resp);
}
