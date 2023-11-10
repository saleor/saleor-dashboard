import { gql } from "@apollo/client";

export const homeAnalitics = gql`
  query HomeAnalitics(
    $channel: String!
    $datePeriod: DateRangeInput!
    $hasPermissionToManageOrders: Boolean!
  ) {
    salesToday: ordersTotal(period: TODAY, channel: $channel)
      @include(if: $hasPermissionToManageOrders) {
      gross {
        amount
        currency
      }
    }
    ordersToday: orders(filter: { created: $datePeriod }, channel: $channel)
      @include(if: $hasPermissionToManageOrders) {
      totalCount
    }
  }
`;

export const homeActivities = gql`
  query HomeActivities($hasPermissionToManageOrders: Boolean!) {
    activities: homepageEvents(last: 10)
      @include(if: $hasPermissionToManageOrders) {
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

export const homeTopProducts = gql`
  query HomeTopProducts(
    $channel: String!
    $hasPermissionToManageProducts: Boolean!
  ) {
    productTopToday: reportProductSales(
      period: TODAY
      first: 5
      channel: $channel
    ) @include(if: $hasPermissionToManageProducts) {
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
  }
`;

export const homeNotifications = gql`
  query homeNotifications(
    $channel: String!
    $hasPermissionToManageOrders: Boolean!
  ) {
    ordersToFulfill: orders(
      filter: { status: READY_TO_FULFILL }
      channel: $channel
    ) @include(if: $hasPermissionToManageOrders) {
      totalCount
    }
    ordersToCapture: orders(
      filter: { status: READY_TO_CAPTURE }
      channel: $channel
    ) @include(if: $hasPermissionToManageOrders) {
      totalCount
    }
    productsOutOfStock: products(
      filter: { stockAvailability: OUT_OF_STOCK }
      channel: $channel
    ) {
      totalCount
    }
  }
`;
