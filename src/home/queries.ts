import { gql } from "@apollo/client";

export const homeAnalitics = gql`
  query HomeAnalitics($channel: String!, $datePeriod: DateRangeInput!) {
    salesToday: ordersTotal(period: TODAY, channel: $channel) {
      gross {
        amount
        currency
      }
    }
    ordersToday: orders(filter: { created: $datePeriod }, channel: $channel) {
      totalCount
    }
  }
`;

export const homeActivities = gql`
  query HomeActivities {
    activities: homepageEvents(last: 10) {
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
  query HomeTopProducts($channel: String!) {
    productTopToday: reportProductSales(
      period: TODAY
      first: 5
      channel: $channel
    ) {
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
