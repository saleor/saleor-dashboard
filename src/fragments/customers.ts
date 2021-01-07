import gql from "graphql-tag";

import { fragmentAddress } from "./address";
import { metadataFragment } from "./metadata";

export const customerFragment = gql`
  fragment CustomerFragment on User {
    id
    email
    firstName
    lastName
  }
`;

export const customerDetailsFragment = gql`
  ${metadataFragment}
  ${customerFragment}
  ${fragmentAddress}
  fragment CustomerDetailsFragment on User {
    ...CustomerFragment
    ...MetadataFragment
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
