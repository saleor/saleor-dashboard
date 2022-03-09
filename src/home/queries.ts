import { gql } from "@apollo/client";

export const home = gql`
  query Home(
    $channel: String!
    $datePeriod: DateRangeInput!
    $PERMISSION_MANAGE_PRODUCTS: Boolean!
    $PERMISSION_MANAGE_ORDERS: Boolean!
  ) {
    salesToday: ordersTotal(period: TODAY, channel: $channel)
      @include(if: $PERMISSION_MANAGE_ORDERS) {
      gross {
        amount
        currency
      }
    }
    ordersToday: orders(filter: { created: $datePeriod }, channel: $channel)
      @include(if: $PERMISSION_MANAGE_ORDERS) {
      totalCount
    }
    ordersToFulfill: orders(
      filter: { status: READY_TO_FULFILL }
      channel: $channel
    ) @include(if: $PERMISSION_MANAGE_ORDERS) {
      totalCount
    }
    ordersToCapture: orders(
      filter: { status: READY_TO_CAPTURE }
      channel: $channel
    ) @include(if: $PERMISSION_MANAGE_ORDERS) {
      totalCount
    }
    productsOutOfStock: products(
      filter: { stockAvailability: OUT_OF_STOCK }
      channel: $channel
    ) {
      totalCount
    }
    productTopToday: reportProductSales(
      period: TODAY
      first: 5
      channel: $channel
    ) @include(if: $PERMISSION_MANAGE_PRODUCTS) {
      edges {
        node {
          id
          revenue(period: TODAY) {
            gross {
              amount
              currency
            }
          }
          attributes {
            values {
              id
              name
            }
          }
          product {
            id
            name
            thumbnail {
              url
            }
          }
          quantityOrdered
        }
      }
    }
    activities: homepageEvents(last: 10)
      @include(if: $PERMISSION_MANAGE_ORDERS) {
      edges {
        node {
          amount
          composedId
          date
          email
          emailType
          id
          message
          orderNumber
          oversoldItems
          quantity
          type
          user {
            id
            email
          }
        }
      }
    }
  }
`;
