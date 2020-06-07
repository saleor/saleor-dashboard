import gql from "graphql-tag";

import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import makeQuery from "@saleor/hooks/makeQuery";
import { TypedQuery } from "../queries";
import { OrderDetails, OrderDetailsVariables } from "./types/OrderDetails";
import {
  OrderDraftList,
  OrderDraftListVariables
} from "./types/OrderDraftList";
import { OrderList, OrderListVariables } from "./types/OrderList";
import {
  SearchOrderVariant as SearchOrderVariantType,
  SearchOrderVariantVariables
} from "./types/SearchOrderVariant";
import {
  OrderFulfillData,
  OrderFulfillDataVariables
} from "./types/OrderFulfillData";

export const fragmentOrderEvent = gql`
  fragment OrderEventFragment on OrderEvent {
    id
    amount
    date
    email
    emailType
    message
    quantity
    type
    user {
      id
      email
    }
  }
`;
export const fragmentAddress = gql`
  fragment AddressFragment on Address {
    city
    cityArea
    companyName
    country {
      __typename
      code
      country
    }
    countryArea
    firstName
    id
    lastName
    phone
    postalCode
    streetAddress1
    streetAddress2
  }
`;
export const fragmentOrderLine = gql`
  fragment OrderLineFragment on OrderLine {
    id
    isShippingRequired
    productName
    productSku
    quantity
    quantityFulfilled
    unitPrice {
      gross {
        amount
        currency
      }
      net {
        amount
        currency
      }
    }
    thumbnail {
      url
    }
  }
`;
export const fulfillmentFragment = gql`
  ${fragmentOrderLine}
  fragment FulfillmentFragment on Fulfillment {
    id
    lines {
      id
      quantity
      orderLine {
        ...OrderLineFragment
      }
    }
    fulfillmentOrder
    status
    trackingNumber
    warehouse {
      id
      name
    }
  }
`;

export const fragmentOrderDetails = gql`
  ${fragmentAddress}
  ${fragmentOrderEvent}
  ${fragmentOrderLine}
  ${fulfillmentFragment}
  fragment OrderDetailsFragment on Order {
    id
    billingAddress {
      ...AddressFragment
    }
    canFinalize
    created
    customerNote
    events {
      ...OrderEventFragment
    }
    fulfillments {
      ...FulfillmentFragment
    }
    lines {
      ...OrderLineFragment
    }
    number
    paymentStatus
    shippingAddress {
      ...AddressFragment
    }
    shippingMethod {
      id
    }
    shippingMethodName
    shippingPrice {
      gross {
        amount
        currency
      }
    }
    status
    subtotal {
      gross {
        amount
        currency
      }
    }
    total {
      gross {
        amount
        currency
      }
      tax {
        amount
        currency
      }
    }
    actions
    totalAuthorized {
      amount
      currency
    }
    totalCaptured {
      amount
      currency
    }
    user {
      id
      email
    }
    userEmail
    availableShippingMethods {
      id
      name
      price {
        amount
        currency
      }
    }
  }
`;

export const orderListQuery = gql`
  ${fragmentAddress}
  query OrderList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: OrderFilterInput
    $sort: OrderSortingInput
  ) {
    orders(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          __typename
          billingAddress {
            ...AddressFragment
          }
          created
          id
          number
          paymentStatus
          status
          total {
            __typename
            gross {
              __typename
              amount
              currency
            }
          }
          userEmail
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
export const useOrderListQuery = makeQuery<OrderList, OrderListVariables>(
  orderListQuery
);

export const orderDraftListQuery = gql`
  ${fragmentAddress}
  query OrderDraftList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: OrderDraftFilterInput
    $sort: OrderSortingInput
  ) {
    draftOrders(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          __typename
          billingAddress {
            ...AddressFragment
          }
          created
          id
          number
          paymentStatus
          status
          total {
            __typename
            gross {
              __typename
              amount
              currency
            }
          }
          userEmail
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
export const useOrderDraftListQuery = makeQuery<
  OrderDraftList,
  OrderDraftListVariables
>(orderDraftListQuery);

export const orderDetailsQuery = gql`
  ${fragmentOrderDetails}
  query OrderDetails($id: ID!) {
    order(id: $id) {
      ...OrderDetailsFragment
    }
    shop {
      countries {
        code
        country
      }
      defaultWeightUnit
    }
  }
`;
export const TypedOrderDetailsQuery = TypedQuery<
  OrderDetails,
  OrderDetailsVariables
>(orderDetailsQuery);

export const searchOrderVariant = gql`
  query SearchOrderVariant($first: Int!, $query: String!, $after: String) {
    search: products(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          variants {
            id
            name
            sku
            pricing {
              priceUndiscounted {
                net {
                  amount
                  currency
                }
              }
            }
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
export const useOrderVariantSearch = makeTopLevelSearch<
  SearchOrderVariantType,
  SearchOrderVariantVariables
>(searchOrderVariant);

const orderFulfillData = gql`
  query OrderFulfillData($orderId: ID!) {
    order(id: $orderId) {
      id
      lines {
        id
        isShippingRequired
        productName
        quantity
        quantityFulfilled
        variant {
          id
          name
          sku
          attributes {
            values {
              id
              name
            }
          }
          stocks {
            id
            warehouse {
              id
            }
            quantity
            quantityAllocated
          }
          trackInventory
        }
        thumbnail(size: 64) {
          url
        }
      }
      number
    }
  }
`;
export const useOrderFulfillData = makeQuery<
  OrderFulfillData,
  OrderFulfillDataVariables
>(orderFulfillData);
