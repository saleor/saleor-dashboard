import { gql } from "@apollo/client";

// TODO: Rename this query to homeActivities when old home page was deleted
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

// TODO: Rename this query to homeAnalytics when old home page was deleted
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

// TODO: Rename this query to homeNotifications when old home page was deleted
export const newHomeNotifications = gql`
  query NewHomeNotifications($channel: String!) {
    productsOutOfStock: products(filter: { stockAvailability: OUT_OF_STOCK }, channel: $channel) {
      totalCount
    }
  }
`;
