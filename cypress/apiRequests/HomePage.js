export function getSalesForChannel(channelSlug, period) {
  const query = `query{
    ordersTotal(period: ${period}, channel:"${channelSlug}"){
      gross{
        amount
      }
    }
  }`;
  return cy.sendRequestWithQuery(query);
}
export function getOrdersForChannel(channelSlug, created) {
  const query = `query{
    orders(created: ${created}, channel:"${channelSlug}"){
      totalCount
    }
  }`;
  return cy.sendRequestWithQuery(query);
}
export function getOrdersWithStatus(status, channelSlug) {
  const query = `query{
    orders(status: ${status}, channel:"${channelSlug}"){
      totalCount
    }
  }`;
  return cy.sendRequestWithQuery(query);
}
export function getProductsOutOfStock(channelSlug) {
  const query = `query{
    products(stockAvailability: OUT_OF_STOCK, channel:"${channelSlug}"){
      totalCount
    }
  }`;
  return cy.sendRequestWithQuery(query);
}
