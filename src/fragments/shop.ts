import gql from "graphql-tag";

import { fragmentAddress } from "./address";

export const limitFragment = gql`
  fragment LimitInfoFragment on Limits {
    channels @include(if: $channels)
    orders @include(if: $orders)
    productVariants @include(if: $productVariants)
    staffUsers @include(if: $staffUsers)
    warehouses @include(if: $warehouses)
  }

  fragment ShopLimitFragment on Shop {
    limits {
      currentUsage {
        ...LimitInfoFragment
      }
      allowedUsage {
        ...LimitInfoFragment
      }
    }
  }
`;

export const shopFragment = gql`
  ${fragmentAddress}
  fragment ShopFragment on Shop {
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
