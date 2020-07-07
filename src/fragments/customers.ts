import gql from "graphql-tag";

import { fragmentAddress } from "./address";

export const customerFragment = gql`
  fragment CustomerFragment on User {
    id
    email
    firstName
    lastName
  }
`;

export const customerDetailsFragment = gql`
  ${customerFragment}
  ${fragmentAddress}
  fragment CustomerDetailsFragment on User {
    ...CustomerFragment
    dateJoined
    lastLogin
    defaultShippingAddress {
      ...AddressFragment
    }
    defaultBillingAddress {
      ...AddressFragment
    }
    note
    isActive
  }
`;

export const customerAddressesFragment = gql`
  ${customerFragment}
  ${fragmentAddress}
  fragment CustomerAddressesFragment on User {
    ...CustomerFragment
    addresses {
      ...AddressFragment
    }
    defaultBillingAddress {
      id
    }
    defaultShippingAddress {
      id
    }
  }
`;
