import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { fragmentAddress } from "../orders/queries";
import { customerAddressesFragment, customerDetailsFragment } from "./queries";
import {
  BulkRemoveCustomers,
  BulkRemoveCustomersVariables
} from "./types/BulkRemoveCustomers";
import {
  CreateCustomer,
  CreateCustomerVariables
} from "./types/CreateCustomer";
import {
  CreateCustomerAddress,
  CreateCustomerAddressVariables
} from "./types/CreateCustomerAddress";
import {
  RemoveCustomer,
  RemoveCustomerVariables
} from "./types/RemoveCustomer";
import {
  RemoveCustomerAddress,
  RemoveCustomerAddressVariables
} from "./types/RemoveCustomerAddress";
import {
  SetCustomerDefaultAddress,
  SetCustomerDefaultAddressVariables
} from "./types/SetCustomerDefaultAddress";
import {
  UpdateCustomer,
  UpdateCustomerVariables
} from "./types/UpdateCustomer";
import {
  UpdateCustomerAddress,
  UpdateCustomerAddressVariables
} from "./types/UpdateCustomerAddress";

export const accountFragmentError = gql`
  fragment AccountErrorFragment on AccountError {
    code
    field
  }
`;

const updateCustomer = gql`
  ${accountFragmentError}
  ${customerDetailsFragment}
  mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
    customerUpdate(id: $id, input: $input) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
      user {
        ...CustomerDetailsFragment
      }
    }
  }
`;
export const TypedUpdateCustomerMutation = TypedMutation<
  UpdateCustomer,
  UpdateCustomerVariables
>(updateCustomer);

const createCustomer = gql`
  ${accountFragmentError}
  mutation CreateCustomer($input: UserCreateInput!) {
    customerCreate(input: $input) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
      user {
        id
      }
    }
  }
`;
export const TypedCreateCustomerMutation = TypedMutation<
  CreateCustomer,
  CreateCustomerVariables
>(createCustomer);

const removeCustomer = gql`
  ${accountFragmentError}
  mutation RemoveCustomer($id: ID!) {
    customerDelete(id: $id) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
    }
  }
`;
export const TypedRemoveCustomerMutation = TypedMutation<
  RemoveCustomer,
  RemoveCustomerVariables
>(removeCustomer);

const setCustomerDefaultAddress = gql`
  ${accountFragmentError}
  ${customerAddressesFragment}
  mutation SetCustomerDefaultAddress(
    $addressId: ID!
    $userId: ID!
    $type: AddressTypeEnum!
  ) {
    addressSetDefault(addressId: $addressId, userId: $userId, type: $type) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
      user {
        ...CustomerAddressesFragment
      }
    }
  }
`;
export const TypedSetCustomerDefaultAddressMutation = TypedMutation<
  SetCustomerDefaultAddress,
  SetCustomerDefaultAddressVariables
>(setCustomerDefaultAddress);

const createCustomerAddress = gql`
  ${accountFragmentError}
  ${customerAddressesFragment}
  ${fragmentAddress}
  mutation CreateCustomerAddress($id: ID!, $input: AddressInput!) {
    addressCreate(userId: $id, input: $input) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
      address {
        ...AddressFragment
      }
      user {
        ...CustomerAddressesFragment
      }
    }
  }
`;
export const TypedCreateCustomerAddressMutation = TypedMutation<
  CreateCustomerAddress,
  CreateCustomerAddressVariables
>(createCustomerAddress);

const updateCustomerAddress = gql`
  ${accountFragmentError}
  ${fragmentAddress}
  mutation UpdateCustomerAddress($id: ID!, $input: AddressInput!) {
    addressUpdate(id: $id, input: $input) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
      address {
        ...AddressFragment
      }
    }
  }
`;
export const TypedUpdateCustomerAddressMutation = TypedMutation<
  UpdateCustomerAddress,
  UpdateCustomerAddressVariables
>(updateCustomerAddress);

const removeCustomerAddress = gql`
  ${accountFragmentError}
  ${customerAddressesFragment}
  mutation RemoveCustomerAddress($id: ID!) {
    addressDelete(id: $id) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
      user {
        ...CustomerAddressesFragment
      }
    }
  }
`;
export const TypedRemoveCustomerAddressMutation = TypedMutation<
  RemoveCustomerAddress,
  RemoveCustomerAddressVariables
>(removeCustomerAddress);

export const bulkRemoveCustomers = gql`
  ${accountFragmentError}
  mutation BulkRemoveCustomers($ids: [ID]!) {
    customerBulkDelete(ids: $ids) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
    }
  }
`;
export const TypedBulkRemoveCustomers = TypedMutation<
  BulkRemoveCustomers,
  BulkRemoveCustomersVariables
>(bulkRemoveCustomers);
