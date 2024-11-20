import { gql } from "@apollo/client";

// TODO: Remove this query to homeActivities
export const newHomeActivities = gql`
  query NewHomeActivities($hasPermissionToManageOrders: Boolean!) {
    activities: homepageEvents(last: 10) @include(if: $hasPermissionToManageOrders) {
      edges {
        node {
          date
          email
          message
          orderNumber
          type
          user {
            email
          }
        }
      }
    }
  }
`;

// TODO: Remove this query to homeAnalytics
export const newHomeAnalytics = gql`
  query NewHomeAnalytics($channel: String!, $hasPermissionToManageOrders: Boolean!) {
    salesToday: ordersTotal(period: TODAY, channel: $channel)
      @include(if: $hasPermissionToManageOrders) {
      gross {
        amount
        currency
      }
    }
  }
`;

// TODO: Remove this query to homeNotifications
export const newHomeNotifications = gql`
  query NewHomeNotifications($channel: String!) {
    productsOutOfStock: products(filter: { stockAvailability: OUT_OF_STOCK }, channel: $channel) {
      totalCount
    }
  }
`;
