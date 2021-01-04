import gql from "graphql-tag";

import { fragmentAddress } from "./address";

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
