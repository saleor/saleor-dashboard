import Checkout from "../apiRequests/Checkout";
import Order from "../apiRequests/Order";
import Promises from "../support/promises/promises";

class OrdersUtils {
  promises = new Promises();
  checkoutRequest = new Checkout();
  orderRequest = new Order();

  checkout;
  order;

  async createWaitingForCaptureOrder(
    channelSlug,
    email,
    variantsList,
    shippingMethodId
  ) {
    await this.createCheckout(channelSlug, email, variantsList);
    this.addShippingMethod(this.checkout.id, shippingMethodId);
    this.addPayment(this.checkout.id);
    this.completeCheckout(this.checkout.id);
  }
  async createReadyToFulfillOrder(
    customerId,
    shippingMethodId,
    channelId,
    variantsList
  ) {
    await this.createDraftOrder(customerId, shippingMethodId, channelId);
    variantsList.forEach(variantElement => {
      this.orderRequest.addProductToOrder(this.order.id, variantElement.id);
    });
    this.markOrderAsPaid(this.order.id);
    this.completeOrder(this.order.id);
  }
  async createDraftOrder(customerId, shippingMethodId, channelId) {
    const respProm = await this.promises.createPromise(
      this.orderRequest.createDraftOrder(
        customerId,
        shippingMethodId,
        channelId
      )
    );
    this.order = respProm.draftOrderCreate.order;
  }
  async completeOrder(orderId) {
    await this.promises.createPromise(this.orderRequest.completeOrder(orderId));
  }
  async markOrderAsPaid(orderId) {
    await this.promises.createPromise(
      this.orderRequest.markOrderAsPaid(orderId)
    );
  }
  async createCheckout(channelSlug, email, variantsList) {
    const respProm = await this.promises.createPromise(
      this.checkoutRequest.createCheckout(channelSlug, email, 1, variantsList)
    );
    this.checkout = respProm.checkoutCreate.checkout;
  }
  async addShippingMethod(checkoutId, shippingMethodId) {
    await this.promises.createPromise(
      this.checkoutRequest.addShippingMethod(checkoutId, shippingMethodId)
    );
  }
  async addPayment(checkoutId) {
    await this.promises.createPromise(
      this.checkoutRequest.addPayment(
        checkoutId,
        "mirumee.payments.dummy",
        "not-charged"
      )
    );
  }
  async completeCheckout(checkoutId) {
    await this.promises.createPromise(
      this.checkoutRequest.completeCheckout(checkoutId)
    );
  }
}
export default OrdersUtils;
