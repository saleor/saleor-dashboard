import { gql } from "@apollo/client";

export const customerList = gql`
  query ListCustomers(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: CustomerFilterInput
    $sort: UserSortingInput
    $PERMISSION_MANAGE_ORDERS: Boolean!
  ) {
    customers(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...Customer
          orders @include(if: $PERMISSION_MANAGE_ORDERS) {
            totalCount
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const customerDetails = gql`
  query CustomerDetails(
    $id: ID!
    $PERMISSION_MANAGE_ORDERS: Boolean!
    $PERMISSION_MANAGE_STAFF: Boolean!
    $kpiChannelId: ID!
    $includeKpiOrderCount: Boolean!
  ) {
    user(id: $id) {
      ...CustomerDetails
      metadata {
        ...MetadataItem
      }
      privateMetadata @include(if: $PERMISSION_MANAGE_STAFF) {
        ...MetadataItem
      }
      orders(first: 10) @include(if: $PERMISSION_MANAGE_ORDERS) {
        totalCount
        edges {
          node {
            id
            created
            number
            paymentStatus
            total {
              gross {
                currency
                amount
              }
            }
            subtotal {
              net {
                currency
                amount
              }
            }
            chargeStatus
          }
        }
      }
      kpiOrderChannels: orders(first: 50) @include(if: $PERMISSION_MANAGE_ORDERS) {
        edges {
          node {
            id
            status
            created
            channel {
              id
              name
              slug
              isActive
              currencyCode
            }
          }
        }
      }
      kpiOrders: orders(first: 50, where: { channelId: { eq: $kpiChannelId } })
        @include(if: $includeKpiOrderCount) {
        edges {
          node {
            id
            status
            created
            subtotal {
              net {
                amount
                currency
              }
            }
            shippingPrice {
              gross {
                amount
                currency
              }
            }
            totalRefunded {
              amount
              currency
            }
            channel {
              id
              name
              slug
              isActive
              currencyCode
            }
          }
        }
      }
      kpiNonCancelledOrderCount: orders(
        first: 1
        where: {
          AND: [
            {
              status: {
                oneOf: [
                  UNCONFIRMED
                  UNFULFILLED
                  PARTIALLY_FULFILLED
                  PARTIALLY_RETURNED
                  RETURNED
                  FULFILLED
                  EXPIRED
                ]
              }
            }
            { channelId: { eq: $kpiChannelId } }
          ]
        }
      ) @include(if: $includeKpiOrderCount) {
        totalCount
      }
    }
  }
`;

export const customerAddresses = gql`
  query CustomerAddresses($id: ID!) {
    user(id: $id) {
      ...CustomerAddresses
    }
  }
`;

export const customerCreateData = gql`
  query CustomerCreateData {
    shop {
      countries {
        code
        country
      }
    }
  }
`;

export const defaultGraphiQLQuery = `query CustomerDetails($id: ID!) {
  user(id: $id) {
    id
    email
    firstName
    lastName
  }
}`;
