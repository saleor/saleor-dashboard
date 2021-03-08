import gql from "graphql-tag";

import { fragmentAddress } from "./address";

export const limitFragment = gql`
  fragment LimitInfoFragment on Limits {
    channels
    orders
    productVariants
    staffUsers
    warehouses
  }

  fragment ShopLimitFragment on Shop {
    limits {
      currentUsage {
        ...LimitInfoFragment
      }
      maximumUsage {
        ...LimitInfoFragment
      }
    }
  }
`;

export const shopFragment = gql`
  ${fragmentAddress}
  ${limitFragment}
  fragment ShopFragment on Shop {
    ...ShopLimitFragment
    companyAddress {
      ...AddressFragment
    }
    countries {
      code
      country
    }
    customerSetPasswordUrl
    defaultMailSenderAddress
    defaultMailSenderName
    description
    domain {
      host
    }
    name
  }
`;
