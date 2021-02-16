import Checkout from "../apiRequests/Checkout";
import Order from "../apiRequests/Order";

class OrdersUtils {
  checkoutRequest = new Checkout();
  orderRequest = new Order();

  checkout;
  order;

  createWaitingForCaptureOrder(
    channelSlug,
    email,
    variantsList,
    shippingMethodId
  ) {
    return this.createCheckout(channelSlug, email, variantsList)
      .then(() =>
        this.checkoutRequest.addShippingMethod(
          this.checkout.id,
          shippingMethodId
        )
      )
      .then(() => this.addPayment(this.checkout.id))
      .then(() => this.checkoutRequest.completeCheckout(this.checkout.id));
  }
  createReadyToFulfillOrder(
    customerId,
    shippingMethodId,
    channelId,
    variantsList
  ) {
    return this.createDraftOrder(customerId, shippingMethodId, channelId)
      .then(() => {
        variantsList.forEach(variantElement => {
          this.orderRequest.addProductToOrder(this.order.id, variantElement.id);
        });
      })
      .then(() => this.orderRequest.markOrderAsPaid(this.order.id))
      .then(() => this.orderRequest.completeOrder(this.order.id));
  }
  createDraftOrder(customerId, shippingMethodId, channelId) {
    return this.orderRequest
      .createDraftOrder(customerId, shippingMethodId, channelId)
      .then(resp => (this.order = resp.body.data.draftOrderCreate.order));
  }
  createCheckout(channelSlug, email, variantsList) {
    return this.checkoutRequest
      .createCheckout(channelSlug, email, 1, variantsList)
      .then(resp => (this.checkout = resp.body.data.checkoutCreate.checkout));
  }
  addPayment(checkoutId) {
    return this.checkoutRequest.addPayment(
      checkoutId,
      "mirumee.payments.dummy",
      "not-charged"
    );
  }
}
export default OrdersUtils;
