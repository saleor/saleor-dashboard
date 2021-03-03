import HomePage from "../apiRequests/HomePage";
class HomePageUtils {
  homePage = new HomePage();
  getOrdersReadyToFulfill(channelSlug) {
    return this.homePage
      .getOrdersWithStatus("READY_TO_FULFILL", channelSlug)
      .then(resp => resp.body.data.orders.totalCount);
  }
  getOrdersReadyForCapture(channelSlug) {
    return this.homePage
      .getOrdersWithStatus("READY_TO_CAPTURE", channelSlug)
      .then(resp => resp.body.data.orders.totalCount);
  }
  getProductsOutOfStock(channelSlug) {
    return this.homePage
      .getProductsOutOfStock(channelSlug)
      .then(resp => resp.body.data.products.totalCount);
  }
  getSalesAmount(channelSlug) {
    return this.homePage
      .getSalesForChannel(channelSlug, "TODAY")
      .then(resp => resp.body.data.ordersTotal.gross.amount);
  }
  getTodaysOrders(channelSlug) {
    return this.homePage
      .getOrdersForChannel(channelSlug, "TODAY")
      .then(resp => resp.body.data.orders.totalCount);
  }
}
export default HomePageUtils;
