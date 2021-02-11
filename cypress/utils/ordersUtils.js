import Checkout from "../apiRequests/Checkout";
import Order from "../apiRequests/Order";

class OrdersUtils {
  createWaitingForCaptureOrder(
    channelSlug,
    email,
    variantsList,
    shippingMethodId
  ) {
    const checkout = new Checkout();
    return checkout
      .createCheckout(channelSlug, email, 1, variantsList)
      .then(createCheckoutResp => {
        const checkoutId =
          createCheckoutResp.body.data.checkoutCreate.checkout.id;
        return checkout
          .addShippingMethod(checkoutId, shippingMethodId)
          .then(() =>
            checkout
              .addPayment(checkoutId, "mirumee.payments.dummy", "not-charged")
              .then(() => checkout.completeCheckout(checkoutId))
          );
      });
  }
  createReadyToFulfillOrder(
    customerId,
    shippingMethodId,
    channelId,
    variantsList
  ) {
    const order = new Order();
    return order
      .createDraftOrder(customerId, shippingMethodId, channelId)
      .then(draftOrderResp => {
        const orderId = draftOrderResp.body.data.draftOrderCreate.order.id;
        variantsList.forEach(variantElement => {
          order.addProductToOrder(orderId, variantElement.id);
        });
        return order
          .markOrderAsPaid(orderId)
          .then(() => order.completeOrder(orderId));
      });
  }
}
export default OrdersUtils;
