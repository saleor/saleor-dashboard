import { fragmentAddress } from "@saleor/fragments/address";
import {
  fragmentOrderDetails,
  fragmentOrderSettings,
  fragmentRefundOrderLine,
  fragmentShopOrderSettings
} from "@saleor/fragments/orders";
import { fragmentMoney } from "@saleor/fragments/products";
import { warehouseFragment } from "@saleor/fragments/warehouses";
import makeQuery from "@saleor/hooks/makeQuery";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { OrderDetails, OrderDetailsVariables } from "./types/OrderDetails";
import {
  OrderDraftList,
  OrderDraftListVariables
} from "./types/OrderDraftList";
import {
  OrderFulfillData,
  OrderFulfillDataVariables
} from "./types/OrderFulfillData";
import { OrderFulfillSettings } from "./types/OrderFulfillSettings";
import { OrderList, OrderListVariables } from "./types/OrderList";
import {
  OrderRefundData,
  OrderRefundDataVariables
} from "./types/OrderRefundData";
import { OrderSettings } from "./types/OrderSettings";
import {
  SearchOrderVariant as SearchOrderVariantType,
  SearchOrderVariantVariables
} from "./types/SearchOrderVariant";

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
  ${fragmentMoney}
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
      fulfillmentAllowUnpaid
      fulfillmentAutoApprove
    }
  }
`;

export const TypedOrderDetailsQuery = TypedQuery<
  OrderDetails,
  OrderDetailsVariables
>(orderDetailsQuery);

export const useOrderQuery = makeQuery<OrderDetails, OrderDetailsVariables>(
  orderDetailsQuery
);

export const searchOrderVariant = gql`
  ${fragmentMoney}
  query SearchOrderVariant(
    $channel: String!
    $first: Int!
    $query: String!
    $after: String
    $address: AddressInput
  ) {
    search: products(
      first: $first
      after: $after
      filter: { search: $query }
      channel: $channel
    ) {
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
            pricing(address: $address) {
              priceUndiscounted {
                gross {
                  ...Money
                }
              }
              price {
                gross {
                  ...Money
                }
              }
              onSale
            }
            channelListings {
              channel {
                id
                isActive
                name
                currencyCode
              }
              price {
                amount
                currency
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
  ${warehouseFragment}
  query OrderFulfillData($orderId: ID!) {
    order(id: $orderId) {
      id
      isPaid
      deliveryMethod {
        __typename
        ... on ShippingMethod {
          id
        }
        ... on Warehouse {
          id
          clickAndCollectOption
        }
      }
      lines {
        id
        isShippingRequired
        productName
        quantity
        allocations {
          quantity
          warehouse {
            id
          }
        }
        quantityFulfilled
        quantityToFulfill
        variant {
          id
          name
          sku
          preorder {
            endDate
          }
          attributes {
            values {
              id
              name
            }
          }
          stocks {
            id
            warehouse {
              ...WarehouseFragment
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

export const orderFulfillSettingsQuery = gql`
  ${fragmentShopOrderSettings}
  query OrderFulfillSettings {
    shop {
      ...ShopOrderSettingsFragment
    }
  }
`;
export const useOrderFulfillSettingsQuery = makeQuery<
  OrderFulfillSettings,
  never
>(orderFulfillSettingsQuery);

export const orderSettingsQuery = gql`
  ${fragmentOrderSettings}
  ${fragmentShopOrderSettings}
  query OrderSettings {
    orderSettings {
      ...OrderSettingsFragment
    }
    shop {
      ...ShopOrderSettingsFragment
    }
  }
`;
export const useOrderSettingsQuery = makeQuery<OrderSettings, never>(
  orderSettingsQuery
);

const orderRefundData = gql`
  ${fragmentMoney}
  ${fragmentRefundOrderLine}
  query OrderRefundData($orderId: ID!) {
    order(id: $orderId) {
      id
      number
      total {
        gross {
          ...Money
        }
      }
      totalCaptured {
        ...Money
      }
      shippingPrice {
        gross {
          ...Money
        }
      }
      lines {
        ...RefundOrderLineFragment
        quantityToFulfill
      }
      fulfillments {
        id
        status
        fulfillmentOrder
        lines {
          id
          quantity
          orderLine {
            ...RefundOrderLineFragment
          }
        }
      }
    }
  }
`;
export const useOrderRefundData = makeQuery<
  OrderRefundData,
  OrderRefundDataVariables
>(orderRefundData);
