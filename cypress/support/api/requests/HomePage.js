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
export function getOrdersForChannel(channelSlug, { gte, lte }) {
  const query = `query{
    orders(filter: { created: { gte: "${gte}", lte: "${lte}" } }, channel:"${channelSlug}"){
      totalCount
    }
  }`;
  return cy.sendRequestWithQuery(query);
}
export function getOrdersWithStatus(status, channelSlug) {
  const query = `query{
    orders(filter: { status: ${status} }, channel:"${channelSlug}"){
      totalCount
    }
  }`;
  return cy.sendRequestWithQuery(query);
}
export function getProductsOutOfStock(channelSlug) {
  const query = `query{
    products(filter: { stockAvailability: OUT_OF_STOCK} channel:"${channelSlug}" ){
      totalCount
    }
  }`;
  return cy.sendRequestWithQuery(query);
}
