import { gql } from "@apollo/client";
import {
  customerAddressesFragment,
  customerDetailsFragment,
  customerFragment
} from "@saleor/fragments/customers";
import makeQuery from "@saleor/hooks/makeQuery";

import { TypedQuery } from "../queries";
import {
  CustomerAddresses,
  CustomerAddressesVariables
} from "./types/CustomerAddresses";
import { CustomerCreateData } from "./types/CustomerCreateData";
import {
  CustomerDetails,
  CustomerDetailsVariables
} from "./types/CustomerDetails";
import { ListCustomers, ListCustomersVariables } from "./types/ListCustomers";

const customerList = gql`
  ${customerFragment}
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
          ...CustomerFragment
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
export const useCustomerListQuery = makeQuery<
  ListCustomers,
  ListCustomersVariables
>(customerList);

const customerDetails = gql`
  ${customerDetailsFragment}
  query CustomerDetails($id: ID!, $PERMISSION_MANAGE_ORDERS: Boolean!) {
    user(id: $id) {
      ...CustomerDetailsFragment
      orders(last: 5) @include(if: $PERMISSION_MANAGE_ORDERS) {
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
          }
        }
      }
      lastPlacedOrder: orders(last: 1) @include(if: $PERMISSION_MANAGE_ORDERS) {
        edges {
          node {
            id
            created
          }
        }
      }
    }
  }
`;

export const useCustomerDetails = makeQuery<
  CustomerDetails,
  CustomerDetailsVariables
>(customerDetails);

const customerAddresses = gql`
  ${customerAddressesFragment}
  query CustomerAddresses($id: ID!) {
    user(id: $id) {
      ...CustomerAddressesFragment
    }
  }
`;
export const TypedCustomerAddressesQuery = TypedQuery<
  CustomerAddresses,
  CustomerAddressesVariables
>(customerAddresses);
export const useCustomerAddressesQuery = makeQuery<
  CustomerAddresses,
  CustomerAddressesVariables
>(customerAddresses);

const customerCreateData = gql`
  query CustomerCreateData {
    shop {
      countries {
        code
        country
      }
    }
  }
`;
export const TypedCustomerCreateDataQuery = TypedQuery<CustomerCreateData, {}>(
  customerCreateData
);
